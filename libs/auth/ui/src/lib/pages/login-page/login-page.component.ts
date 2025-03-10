import { CommonModule } from '@angular/common';
import { Component, Inject, Optional, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { IonicModule, NavController } from '@ionic/angular';
import {
	AuthProviderID,
	AuthProviderName,
	AuthStatuses,
	ILoginEventsHandler,
	ISneatAuthState,
	LoginEventsHandler,
	SneatAuthStateService,
} from '@sneat/auth-core';
import { SneatUserService } from '@sneat/auth-core';
import {
	AnalyticsService,
	APP_INFO,
	IAnalyticsService,
	IAppInfo,
} from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SneatBaseComponent } from '@sneat/ui';
import { Subject, takeUntil } from 'rxjs';
import {
	EmailFormSigningWith,
	EmailLoginFormComponent,
} from './email-login-form/email-login-form.component';
import { UserCredential } from 'firebase/auth';
import { LoginWithTelegramComponent } from './login-with-telegram.component';

type Action = 'join' | 'refuse'; // TODO: inject provider for action descriptions/messages.

@Component({
	selector: 'sneat-login',
	templateUrl: './login-page.component.html',
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		LoginWithTelegramComponent,
		EmailLoginFormComponent,
	],
})
export class LoginPageComponent extends SneatBaseComponent {
	protected readonly signingWith = signal<AuthProviderID | undefined>(
		undefined,
	);
	private readonly redirectTo?: string;
	protected readonly to?: string;
	protected readonly action?: Action; // TODO: document possible values?

	protected readonly isNativePlatform = Capacitor.isNativePlatform();

	protected readonly appTitle: string;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		private readonly route: ActivatedRoute,
		private readonly navController: NavController,
		private readonly userService: SneatUserService,
		private readonly authStateService: SneatAuthStateService,
		@Inject(APP_INFO) private appInfo: IAppInfo, // TODO: Unused - remove or implement

		@Optional() // TODO: Unused - remove or implement
		@Inject(LoginEventsHandler)
		private readonly loginEventsHandler: ILoginEventsHandler,
	) {
		super('LoginPageComponent', errorLogger);
		console.log('LoginPageComponent.constructor()');
		this.appTitle = appInfo.appTitle || 'Sneat.app';
		if (location.hash.startsWith('#/')) {
			this.redirectTo = location.hash.substring(1);
		}
		this.to = this.route.snapshot.queryParams['to']; // should we subscribe? I believe no.
		const action = location.hash.match(/[#&]action=(\w+)/);
		this.action = action?.[1] as Action;

		const userRecordLoaded = new Subject<void>();
		this.userService.userState
			.pipe(takeUntil(userRecordLoaded), this.takeUntilDestroyed())
			.subscribe({
				next: (userState) => {
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
	}

	protected onEmailFormStatusChanged(signingWith?: EmailFormSigningWith): void {
		this.signingWith.set(signingWith as AuthProviderID);
	}

	protected async loginWith(provider: AuthProviderID) {
		const logPrefix = `LoginPageComponent.loginWith(provider=${provider})`;
		console.log(logPrefix + ' started');
		this.signingWith.set(provider);
		try {
			await this.authStateService.signInWith(provider);
			// We do not reset this.signingWith in case of succesful sign in as we should redirect from login page
			// and not to allow user to do a double sign-in.
		} catch (e) {
			const errMsg = (e as { errorMessage?: string }).errorMessage;
			if (
				errMsg !== 'The user canceled the sign-in flow.' &&
				!errMsg?.includes(
					'com.apple.AuthenticationServices.AuthorizationError error 1001.',
				)
			) {
				this.errorLogger.logError(e, `Failed to sign-in with ${provider}`);
			}
			this.signingWith.set(undefined);
		}
	}

	protected onLoggedIn(userCredential: UserCredential): void {
		console.log('LoginPage.onLoggedIn(userCredential):', userCredential);
		this.signingWith.set(undefined);
		if (!userCredential.user) {
			return;
		}
		if (userCredential.user.email) {
			const prevEmail = localStorage.getItem('emailForSignIn') || '';
			if (!prevEmail) {
				localStorage.setItem('emailForSignIn', userCredential.user.email);
			}
		}
		const authState: ISneatAuthState = {
			status: AuthStatuses.authenticated,
			user: userCredential.user,
		};
		this.userService.onUserSignedIn(authState);
	}

	private errorHandler(
		m: string,
		eventName?: string,
		eventParams?: Record<string, string>,
	): (err: unknown) => void {
		return (err) => this.handleError(err, m, eventName, eventParams);
	}

	private handleError(
		err: unknown,
		m: string,
		eventName?: string,
		eventParams?: Record<string, string>,
	): void {
		if (eventName) {
			this.analyticsService.logEvent(eventName, eventParams);
		}
		this.errorLogger.logError(err, m, {
			report: !(err as { code: unknown }).code,
		});
		this.signingWith.set(undefined);
	}
}
