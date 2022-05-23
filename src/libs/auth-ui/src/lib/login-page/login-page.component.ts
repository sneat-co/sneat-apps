// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Component, Inject, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	AuthStatuses,
	ILoginEventsHandler,
	ISneatAuthState,
	LoginEventsHandler,
	SneatAuthStateService,
} from '@sneat/auth';
import { SneatApiService } from '@sneat/api';
import { RandomIdService } from '@sneat/random';
import { SneatUserService } from '@sneat/user';
import { Subject, takeUntil } from 'rxjs';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import OAuthProvider = firebase.auth.OAuthProvider;
import FacebookAuthProvider = firebase.auth.FacebookAuthProvider;
import GithubAuthProvider = firebase.auth.GithubAuthProvider;
import AuthProvider = firebase.auth.AuthProvider;
import UserCredential = firebase.auth.UserCredential;

type AuthProviderName = 'Google' | 'Microsoft' | 'Facebook' | 'GitHub';

type Action = 'join' | 'refuse'; // TODO: inject provider for action descriptions/messages.

@Component({
	selector: 'sneat-login',
	templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
	public signingWith?:
		| AuthProviderName
		| 'email'
		| 'emailLink'
		| 'resetPassword';
	public email = '';
	public password = '';
	public fullName = '';
	public redirectTo?: string;
	public to?: string;
	public action?: Action; // TODO: document possible values?
	public sign: 'in' | 'up' = 'up'; // TODO: document here what 'in' & 'up' means

	constructor(
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		// @Inject(Toaster) private readonly toaster: IToaster,

		private readonly randomIdService: RandomIdService,
		@Inject(LoginEventsHandler)
		@Optional()
		private readonly loginEventsHandler: ILoginEventsHandler,
		private readonly route: ActivatedRoute,
		private readonly afAuth: AngularFireAuth,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly authStateService: SneatAuthStateService,
		// private readonly toastController: ToastController,
		private readonly sneatApiService: SneatApiService,
	) {
		console.log('LoginPageComponent.constructor()');
		this.email = localStorage.getItem('emailForSignIn') || '';
		if (this.email) {
			this.sign = 'in';
		}
		if (location.hash.startsWith('#/')) {
			this.redirectTo = location.hash.substring(1);
		}
		this.to = this.route.snapshot.queryParams['to']; // should we subscribe? I believe no.
		const action = location.hash.match(/[#&]action=(\w+)/);
		this.action = action?.[1] as Action;
	}

	// @ViewChild('emailInput', {static: true}) emailInput: IonInput;

	public get validEmail(): boolean {
		const email = this.email,
			i = email?.indexOf('@');
		return i > 0 && i < email.length - 1;
	}

	ionViewDidEnter(): void {
		// this.setFocusToEmail();
	}

	signChanged(): void {
		// this.setFocusToEmail();
	}

	// private setFocusToEmail(): void {
	// 	this.emailInput.setFocus()
	// 		.catch(err => this.errorLoggerService.logError(err, 'Failed to set focus to email input'));
	// }

	loginWith(provider: AuthProviderName) {
		this.signingWith = provider;
		const eventParams = { provider };
		let authProvider: AuthProvider;
		switch (provider) {
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
			default:
				this.errorLogger.logError(
					'Coding error',
					'Unknown or unsupported auth provider: ' + provider,
				);
				return;
		}
		this.analyticsService.logEvent('loginWith', eventParams);
		this.afAuth
			.signInWithPopup(authProvider)
			.then((userCredential) => {
				// console.log('LoginPage => userCredential:', userCredential);
				this.analyticsService.logEvent('signInWithPopup', eventParams);
				this.onLoggedIn(userCredential);
			})
			.catch(
				this.errorHandler(
					'Failed to sign in with: ' + provider,
					'FailedToSignInWith',
					eventParams,
				),
			);
	}

	private sendVerificationEmail(userCredential: UserCredential): void {
		setTimeout(async () => {
			try {
				await userCredential.user?.sendEmailVerification();
			} catch (e) {
				this.handleError(e, 'Failed to send verification email');
			}
		});
	}

	public async signUp(): Promise<void> {
		if (!this.fullName) {
			// this.toaster.showToast('Full name is required');
			return;
		}
		this.signingWith = 'email';
		this.email = this.email.trim();
		const email = this.email;
		localStorage.setItem('emailForSignIn', email);
		const password = this.randomIdService.newRandomId({ len: 9 });
		try {
			const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
			this.sendVerificationEmail(userCredential);
			userCredential.user
				?.getIdToken()
				.then((token) => {
					this.sneatApiService.setApiAuthToken(token);
					this.userService.setUserTitle(this.fullName.trim()).subscribe({
						next: () => this.onLoggedIn(userCredential),
						error: (err) => {
							this.analyticsService.logEvent('FailedToSetUserTitle');
							this.errorLogger.logError(err, 'Failed to set user title', {
								feedback: false,
							});
							this.onLoggedIn(userCredential);
						},
					});
				})
				.catch(
					this.errorHandler(
						'Failed to get Firebase ID token',
						'FirebaseGetIdTokenFailed',
					),
				);
		} catch (e) {
			this.handleError(e, 'Failed to sign up with email', 'FailedToSignUpWithEmail');
		}
	}

	public keyupEnter(): void {
		switch (this.sign) {
			case 'in':
				this.signIn();
				break;
			case 'up':
				this.signUp().catch(() => this.errorHandler('Failed to sign up'));
				break;
		}
	}

	public signIn(): void {
		this.signingWith = 'email';
		this.email = this.email.trim();
		this.afAuth
			.signInWithEmailAndPassword(this.email, this.password)
			.then((userCredential) => {
				// TODO: add analytics event
				this.onLoggedIn(userCredential);
			})
			.catch(
				this.errorHandler('Failed to sign in with email & password', 'email'),
			);
	}

	public sendSignInLink(): void {
		this.signingWith = 'emailLink';
		this.email = this.email.trim();
		localStorage.setItem('emailForSignIn', this.email);
		this.afAuth
			.sendSignInLinkToEmail(this.email, {
				// url: 'https://dailyscrum.app/pwa/sign-in',
				url: document.baseURI + 'sign-in',
				handleCodeInApp: true,
			})
			.catch(
				this.errorHandler(
					'Failed to send sign in link to email',
					'FailedToSendSignInLinkToEmail',
				),
			);
	}

	public resetPassword(): void {
		this.signingWith = 'resetPassword';
		this.afAuth
			.sendPasswordResetEmail(this.email)
			.then(() => {
				this.signingWith = undefined;
				// this.toastController.create({
				// 	message: `Password reset link has been sent to email: ${this.email}`,
				// }).then(toast => {
				// 	toast.present().catch(this.errorLogger.logErrorHandler('Failed to present toast about password reset email sent success'));
				// });
			})
			.catch(
				this.errorHandler(
					'Failed to send password reset email',
					'FailedToSendPasswordResetEmail',
				),
			);
	}

	private onLoggedIn(userCredential: UserCredential): void {
		console.log('LoginPage.onLoggedIn(userCredential):', userCredential);
		if (!userCredential.user) {
			return;
		}
		const authState: ISneatAuthState = {
			status: AuthStatuses.authenticated,
			user: userCredential.user,
		};
		this.userService.onUserSignedIn(authState);
		// const { to } = this.route.snapshot.queryParams;
		// if (this.to) {
		// 	const queryParams = to ? { ...this.route.snapshot.queryParams } : undefined;
		// 	if (queryParams) {
		// 		delete queryParams['to'];
		// 	}
		// 	this.navController.navigateRoot(this.to, {
		// 		queryParams,
		// 		fragment: location.hash.substring(1),
		// 	}).catch(this.errorLogger.logErrorHandler('Failed to navigate to: ' + to));
		// } else {
		// 	this.loginEventsHandler?.onLoggedIn();
		// }
		const userRecordLoaded = new Subject<void>();
		this.userService.userState
			.pipe(takeUntil(userRecordLoaded))
			.subscribe({
				next: userState => {
					if (userState.record) {
						userRecordLoaded.next();
					} else {
						return;
					}
					console.log('this.redirectTo:', this.redirectTo);
					const redirectTo = this.redirectTo || '/'; // TODO: default one should be app specific.
					this.navController
						.navigateRoot(redirectTo)
						.catch(
							this.errorLogger.logErrorHandler(
								'Failed to navigate back to ' + redirectTo,
							),
						);
				},
				error: this.errorHandler('Failed to get user state after login'),
			});
		// this.userService.
		// this.authStateService.authState.subscribe({
		// 	next: authState => {
		// 	if (authState.user.)
		// 	},
		// 	error: this.errorHandler('Failed to get auth state after logged in'),
		// })
	}

	private errorHandler(
		m: string,
		eventName?: string,
		eventParams?: { [key: string]: string },
	): (err: any) => void {
		return err => this.handleError(err, m, eventName, eventParams);
	}

	private handleError(
		err: any, m: string,
		eventName?: string,
		eventParams?: { [key: string]: string },
	): void {
		if (eventName) {
			this.analyticsService.logEvent(eventName, eventParams);
		}
		this.errorLogger.logError(err, m, { report: !err.code });
		this.signingWith = undefined;
	}
}
