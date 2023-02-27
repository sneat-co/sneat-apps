import { getApp } from '@angular/fire/app';
import { getAuth } from '@angular/fire/auth';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import { BehaviorSubject, from, Observable, share, throwError } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { distinctUntilChanged, shareReplay } from 'rxjs/operators';
import {
	Auth,
	AuthProvider,
	UserCredential,
	FacebookAuthProvider,
	GoogleAuthProvider,
	GithubAuthProvider,
	OAuthProvider,
	UserInfo,
	signInWithEmailLink,
	signInWithPopup,
} from '@angular/fire/auth';

// TODO: fix & remove this eslint hint
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { newRandomId } from '@sneat/random';

export enum AuthStatuses {
	authenticating = 'authenticating',
	authenticated = 'authenticated',
	notAuthenticated = 'notAuthenticated',
}

export type AuthStatus =
	| AuthStatuses.authenticated
	| AuthStatuses.authenticating
	| AuthStatuses.notAuthenticated;

export interface ISneatAuthUser extends UserInfo {
	isAnonymous: boolean;
	emailVerified: boolean;
}

export interface ISneatAuthState {
	status: AuthStatus;
	token?: string | null;
	user?: ISneatAuthUser | null;
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

	private readonly authUser$ = new BehaviorSubject<ISneatAuthUser | null | undefined>(undefined);
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
		@Inject(AnalyticsService) private readonly analyticsService: IAnalyticsService,
		private readonly fbAuth: Auth,
	) {
		console.log(`SneatAuthStateService.constructor(): id=${this.id}`);
		this.fbAuth.onIdTokenChanged({
			next: (fbUser) => {
				const status: AuthStatus = fbUser
					? AuthStatuses.authenticated
					: AuthStatuses.notAuthenticated;
				const current = this.authState$.value || {};
				fbUser?.getIdToken().then(token => {
					this.authState$.next({
						...current,
						status,
						token,
						user: this.authUser$.value,
					});
					this.authStatus$.next(status); // Should be after authState$
				});
			},
			error: errorLogger.logErrorHandler('failed to get Firebase auth token'),
			complete: () => void 0,
		});
		this.fbAuth.onAuthStateChanged({
			complete: () => void 0,
			next: (fbUser) => {
				console.log(`SneatAuthStateService => authStatus: ${this.authStatus$.value}; fbUser`, fbUser);
				const user: ISneatAuthUser | null = fbUser && {
					isAnonymous: fbUser.isAnonymous,
					emailVerified: fbUser.emailVerified,
					email: fbUser.email,
					uid: fbUser.uid,
					displayName: fbUser.displayName,
					phoneNumber: fbUser.phoneNumber,
					photoURL: fbUser.photoURL,
					providerId: fbUser.providerData?.length === 1 && fbUser.providerData[0] ? fbUser.providerData[0].providerId : fbUser.providerId,
				};
				const status = user
					? AuthStatuses.authenticated
					: AuthStatuses.notAuthenticated;
				this.authStatus$.next(status);
				this.authUser$.next(user);
				this.authState$.next({ ...this.authState$.value, user, status });
			},
			error: this.errorLogger.logErrorHandler(
				'failed to retrieve Firebase auth user information',
			),
		});
	}

	public signOut(): Promise<void> {
		return this.fbAuth.signOut();
	}

	public signInWithEmailLink(email: string): Observable<UserCredential> {
		return from(signInWithEmailLink(this.fbAuth, email));
	}

	public signInWith(authProviderName: AuthProviderName): Observable<UserCredential> {
		const eventParams = { provider: authProviderName };
		let authProvider: AuthProvider;
		switch (authProviderName) {
			case 'Google':
				authProvider = new GoogleAuthProvider();
				break;
			case 'Microsoft':
				authProvider = new OAuthProvider('microsoft.com');
				break;
			case 'Facebook':
				authProvider = new FacebookAuthProvider();
				(authProvider as FacebookAuthProvider).addScope('email');
				break;
			case 'GitHub':
				authProvider = new GithubAuthProvider();
				(authProvider as GithubAuthProvider).addScope('read:user');
				(authProvider as GithubAuthProvider).addScope('user:email');
				break;
			default: {
				const e = new Error('Unknown or unsupported auth provider: ' + authProviderName);
				this.errorLogger.logError(e, 'Coding error');
				return throwError(() => e);
			}
		}
		this.analyticsService.logEvent('loginWith', eventParams);
		const result = from(signInWithPopup(this.fbAuth, authProvider))
			.pipe(share());
		result.subscribe({
			next: () => {
				this.analyticsService.logEvent('signInWithPopup', eventParams);
			},
			error: this.errorLogger.logErrorHandler(`Failed to sign-in with ${authProviderName}`),
		});
		return result;
	}
}

export type AuthProviderName = 'Google' | 'Microsoft' | 'Facebook' | 'GitHub';
