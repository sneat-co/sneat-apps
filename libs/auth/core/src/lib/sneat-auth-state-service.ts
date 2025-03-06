import { SignInWithOAuthOptions } from '@capacitor-firebase/authentication/dist/esm/definitions';
import { Capacitor } from '@capacitor/core';
import {
	FirebaseAuthentication,
	SignInResult,
} from '@capacitor-firebase/authentication';
import {
	AnalyticsService,
	EnumAsUnionOfKeys,
	IAnalyticsService,
} from '@sneat/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import {
	Auth,
	AuthProvider,
	getAuth,
	signInWithCredential,
	UserCredential,
	UserInfo,
} from '@angular/fire/auth';

import {
	GoogleAuthProvider,
	OAuthProvider,
	GithubAuthProvider,
	FacebookAuthProvider,
	signInWithEmailLink,
	signInWithCustomToken,
	signInWithPopup,
} from 'firebase/auth';

// TODO: fix & remove this eslint hint @nrwl/nx/enforce-module-boundaries

import { newRandomId } from '@sneat/random';

export enum AuthStatuses {
	authenticating = 'authenticating',
	authenticated = 'authenticated',
	notAuthenticated = 'notAuthenticated',
}

export type AuthStatus = EnumAsUnionOfKeys<typeof AuthStatuses>;

export interface ISneatAuthUser extends UserInfo {
	readonly isAnonymous: boolean;
	readonly emailVerified: boolean;
}

export interface ISneatAuthState {
	readonly status: AuthStatus;
	readonly token?: string | null;
	readonly user?: ISneatAuthUser | null;
	readonly err?: unknown;
}

const initialAuthStatus = AuthStatuses.authenticating;
export const initialSneatAuthState = { status: initialAuthStatus };

@Injectable({ providedIn: 'root' })
export class SneatAuthStateService {
	private readonly id = newRandomId({ len: 5 });

	private readonly authStatus$ = new BehaviorSubject<AuthStatus>(
		initialAuthStatus,
	);
	public readonly authStatus = this.authStatus$
		.asObservable()
		.pipe(distinctUntilChanged());

	private readonly authUser$ = new BehaviorSubject<
		ISneatAuthUser | null | undefined
	>(undefined);
	public readonly authUser = this.authUser$.asObservable();

	private readonly authState$ = new BehaviorSubject<ISneatAuthState>(
		initialSneatAuthState,
	);
	public readonly authState = this.authState$.asObservable().pipe(
		// tap(v => console.log('SneatAuthStateService => SneatAuthState:', v)),
		shareReplay(1),
	);

	// private readonly fbAuth: Auth;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		private readonly fbAuth: Auth,
	) {
		console.log(`SneatAuthStateService.constructor(): id=${this.id}`);
		this.fbAuth.onIdTokenChanged({
			next: (fbUser) => {
				const status: AuthStatus = fbUser
					? AuthStatuses.authenticated
					: AuthStatuses.notAuthenticated;
				fbUser
					?.getIdToken()
					.then((token) => {
						const current = this.authState$.value || {};
						this.authState$.next({
							...current,
							status,
							token,
							user: this.authUser$.value,
						});
						this.authStatus$.next(status); // Should be after authState$
					})
					.catch((err) => {
						const current = this.authState$.value || {};
						this.authState$.next({
							...current,
							err: `fbUser.getIdToken() failed: ${err}`,
						});
						this.errorLogger.logError(err, 'Failed in fbUser.getIdToken()');
					});
			},
			error: (err) => {
				const current = this.authState$.value || {};
				this.authState$.next({
					...current,
					err: `fbAuth.onIdTokenChanged() failed: ${err}`,
				});
				errorLogger.logError(err, 'failed in fbAuth.onIdTokenChanged');
			},
			complete: () => void 0,
		});
		this.fbAuth.onAuthStateChanged({
			complete: () => void 0,
			next: (fbUser) => {
				console.log(
					`SneatAuthStateService => authStatus: ${this.authStatus$.value}; fbUser`,
					fbUser,
				);
				const user: ISneatAuthUser | null = fbUser && {
					isAnonymous: fbUser.isAnonymous,
					emailVerified: fbUser.emailVerified,
					email: fbUser.email,
					uid: fbUser.uid,
					displayName: fbUser.displayName,
					phoneNumber: fbUser.phoneNumber,
					photoURL: fbUser.photoURL,
					providerId:
						fbUser.providerData?.length === 1 && fbUser.providerData[0]
							? fbUser.providerData[0].providerId
							: fbUser.providerId,
				};
				const status = user
					? AuthStatuses.authenticated
					: AuthStatuses.notAuthenticated;
				this.authStatus$.next(status);
				this.authUser$.next(user);
				this.authState$.next({ ...this.authState$.value, user, status });
			},
			error: (err) => {
				this.errorLogger.logError(
					err,
					'failed to retrieve Firebase auth user information',
				);
				const current = this.authState$.value || {};
				this.authState$.next({
					...current,
					err: `fbAuth.onAuthStateChanged() failed: ${err}`,
				});
			},
		});
	}

	public signOut(): Promise<void> {
		return this.fbAuth.signOut();
	}

	public signInWithToken(token: string): Promise<UserCredential> {
		return signInWithCustomToken(this.fbAuth, token);
	}

	public signInWithEmailLink(email: string): Observable<UserCredential> {
		return from(signInWithEmailLink(this.fbAuth, email));
	}

	private isSigningInWith?: AuthProviderName;

	private async signInOnNativeLayer(
		authProviderID: AuthProviderID,
	): Promise<UserCredential> {
		let signInResult: SignInResult | undefined;

		const o: SignInWithOAuthOptions = { skipNativeAuth: true };

		switch (authProviderID) {
			case 'google.com':
				signInResult = await FirebaseAuthentication.signInWithGoogle(o);
				break;
			case 'apple.com':
				signInResult = await FirebaseAuthentication.signInWithApple(o);
				break;
			case 'facebook.com':
				signInResult = await FirebaseAuthentication.signInWithFacebook(o);
				break;
			case 'microsoft.com':
				signInResult = await FirebaseAuthentication.signInWithMicrosoft(o);
				break;
			default:
				return Promise.reject('unsupported auth provider: ' + authProviderID);
		}

		console.log(
			`SneatAuthStateService.signInWith(${authProviderID}) => signed in on native layer, authenticating in webview...`,
			signInResult,
		);
		// we need to authenticate on webview layer using the id token and nonce from signInResult
		const userCredential = await this.authenticateOnWebviewLayer(
			authProviderID,
			signInResult,
		);

		return Promise.resolve(userCredential);
	}

	private async authenticateOnWebviewLayer(
		authProviderID: AuthProviderID,
		signInResult: SignInResult,
	): Promise<UserCredential> {
		const oauthProvider = new OAuthProvider(authProviderID);
		const credential = oauthProvider.credential({
			idToken: signInResult.credential?.idToken,
			rawNonce: signInResult.credential?.nonce,
		});
		const auth = getAuth();
		return Promise.resolve(await signInWithCredential(auth, credential));
	}

	private async signInWithWebSDK(
		authProviderID: AuthProviderID,
	): Promise<UserCredential> {
		let authProvider: AuthProvider | undefined = undefined;

		switch (authProviderID) {
			case 'google.com':
				authProvider = new GoogleAuthProvider();
				break;
			case 'apple.com':
				authProvider = new OAuthProvider('apple.com');
				//
				// https://developer.apple.com/documentation/sign_in_with_apple/incorporating-sign-in-with-apple-into-other-platforms
				// (authProvider as OAuthProvider).setCustomParameters({
				// 	// 	// Localize the Apple authentication screen in current app locale.
				// 	locale: 'en', // TODO: set locale
				// });
				break;
			case 'microsoft.com':
				authProvider = new OAuthProvider('microsoft.com');
				break;
			case 'facebook.com':
				authProvider = new FacebookAuthProvider();
				(authProvider as FacebookAuthProvider).addScope('email');
				break;
			case 'github.com':
				authProvider = new GithubAuthProvider();
				(authProvider as GithubAuthProvider).addScope('read:user');
				(authProvider as GithubAuthProvider).addScope('user:email');
				break;
			default: {
				return Promise.reject(
					'unknown or unsupported auth provider: ' + authProviderID,
				);
			}
		}

		const userCredential = await signInWithPopup(this.fbAuth, authProvider);
		return Promise.resolve(userCredential);
	}

	public async signInWith(
		authProviderID: AuthProviderID,
	): Promise<UserCredential | undefined> {
		console.log(
			`SneatAuthStateService.signInWith(${authProviderID}), isSigningInWith=${this.isSigningInWith}, location.protocol=${location.protocol}`,
		);
		this.analyticsService.logEvent('signingInWith', {
			provider: authProviderID,
		});
		try {
			if (this.isSigningInWith) {
				return Promise.reject(
					new Error(
						`a repeated call to SneatAuthStateService.signInWith(${authProviderID}) white previous sign in with ${this.isSigningInWith} is in progress`,
					),
				);
			}

			let userCredential: UserCredential | undefined = undefined;

			if (Capacitor.isNativePlatform()) {
				userCredential = await this.signInOnNativeLayer(authProviderID);
			} else {
				userCredential = await this.signInWithWebSDK(authProviderID);
			}

			this.isSigningInWith = undefined;
			this.analyticsService.logEvent('signedInWith', {
				provider: authProviderID,
			});
			return Promise.resolve(userCredential);
		} catch (e) {
			this.isSigningInWith = undefined;
			return Promise.reject(e);
		}
	}
}

export type AuthProviderID =
	| 'apple.com'
	| 'google.com'
	| 'microsoft.com'
	| 'facebook.com'
	| 'github.com'
	| 'phone';

export type AuthProviderName =
	| 'Google'
	| 'Apple'
	| 'Microsoft'
	| 'Facebook'
	| 'GitHub';
