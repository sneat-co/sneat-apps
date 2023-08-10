import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
// import { getApp } from '@angular/fire/app';
// import { getAuth } from '@angular/fire/auth';
import { Auth as AngularFireAuth, sendPasswordResetEmail, sendSignInLinkToEmail } from '@angular/fire/auth';
import { IonInput, ToastController } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { IInitUserRecordRequest, UserRecordService } from '@sneat/auth-core';
import { createSetFocusToInput } from '@sneat/components';
import { AnalyticsService, APP_INFO, IAnalyticsService, IAppInfo } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { RandomIdService } from '@sneat/random';
import { UserCredential, sendEmailVerification } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export type EmailFormSigningWith = 'email' | 'emailLink' | 'resetPassword';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, Auth } from 'firebase/auth';

@Component({
	selector: 'sneat-email-login-form',
	templateUrl: 'email-login-form.component.html',
})
export class EmailLoginFormComponent {
	public sign: 'in' | 'up' = 'up'; // TODO: document here what 'in' & 'up' means
	public email = '';
	public password = '';
	public firstName = '';
	public lastName = '';
	public teamTitle = '';
	public wrongPassword = false;

	signingWith?: EmailFormSigningWith;

	@Output() readonly signingWithChange = new EventEmitter<EmailFormSigningWith | undefined>();
	@Output() readonly loggedIn = new EventEmitter<UserCredential>();

	@ViewChild('emailInput', { static: true }) emailInput?: IonInput;
	@ViewChild('teamTitleInput', { static: false }) teamTitleInput?: IonInput;

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	constructor(
		@Inject(APP_INFO) public readonly appInfo: IAppInfo,
		@Inject(AnalyticsService) private readonly analyticsService: IAnalyticsService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly toastController: ToastController,
		private readonly afAuth: AngularFireAuth,
		private readonly randomIdService: RandomIdService,
		private readonly sneatApiService: SneatApiService,
		private readonly userRecordService: UserRecordService,
	) {
		this.email = localStorage.getItem('emailForSignIn') || '';
		if (this.email) {
			this.sign = 'in';
		}
	}

	public get validEmail(): boolean {
		const email = this.email,
			i = email?.indexOf('@');
		return i > 0 && i < email.length - 1;
	}

	public getFirebaseAuth(): Auth {
		return this.afAuth as unknown as Auth; // TODO: pending https://github.com/angular/angularfire/pull/3402
	}
	public async signUp(): Promise<void> {
		if (!this.firstName) {
			// this.toaster.showToast('Full name is required');
			return;
		}
		// this.signingWith = 'email';
		this.email = this.email.trim();
		const email = this.email;
		const first = this.firstName.trim();
		const last = this.lastName.trim();
		if (!email) {
			alert('Email is a required field');
			return;
		}
		if (!first) {
			alert('First name is a required field');
			return;
		}
		if (!last) {
			alert('Last name is a required field');
			return;
		}
		this.teamTitle = this.teamTitle.trim();
		const teamTitle = this.teamTitle;
		if (this.appInfo.requiredTeamType && !teamTitle) {
			alert('Company title is a required field');
			this.setFocusToTeamTitle();
			return;
		}
		localStorage.setItem('emailForSignIn', email);
		const password = this.randomIdService.newRandomId({ len: 9 });

		this.setSigningWith('email');
		try {
			// const auth = getAuth(getApp());
			const auth = this.getFirebaseAuth();
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			this.sendVerificationEmail(userCredential);
			userCredential.user
				?.getIdToken()
				.then((token) => {
					this.sneatApiService.setApiAuthToken(token);
					const request: IInitUserRecordRequest = {
						authProvider: 'password',
						email,
						ianaTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						name: { first, last },
						team: this.appInfo.requiredTeamType ? {
							type: this.appInfo.requiredTeamType,
							title: teamTitle,
						} : undefined,
					};
					this.userRecordService.initUserRecord(request)
						.subscribe({
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
		this.setSigningWith('email');
		this.email = this.email.trim();
		this.wrongPassword = false;
		this.saveEmailForReuse();
		// const auth = getAuth(getApp());
		const auth = this.getFirebaseAuth();
		signInWithEmailAndPassword(auth, this.email, this.password)
			.then((userCredential) => {
				this.onLoggedIn(userCredential); // TODO: add analytics event
			})
			.catch(
				this.errorHandler('Failed to sign in with email & password', 'email'),
			);
	}

	private saveEmailForReuse(): void {
		localStorage.setItem('emailForSignIn', this.email);
	}

	public sendSignInLink(): void {
		this.setSigningWith('emailLink');
		this.email = this.email.trim();
		this.saveEmailForReuse();
		sendSignInLinkToEmail(this.afAuth, this.email, {
			// url: 'https://dailyscrum.app/pwa/sign-in',
			url: document.baseURI + 'sign-in-from-email-link',
			handleCodeInApp: true,
		}).then(() => {
			this.showToast(`Sign-in link has been sent to email: ${this.email}`);
			this.setSigningWith(undefined);
		}).catch(
			this.errorHandler(
				'Failed to send sign in link to email',
				'FailedToSendSignInLinkToEmail',
			),
		);
	}

	private showToast(message: string): void {
		this.toastController.create({
			message,
			position: 'middle',
			keyboardClose: true,
			duration: 3000,
			color: 'tertiary',
			icon: 'send-outline',
			buttons: [{ icon: 'close', role: 'cancel' }],
		}).then(toast => {
			toast.present().catch(this.errorLogger.logErrorHandler('Failed to present toast about password reset email sent success'));
		});

	}

	public resetPassword(): void {
		this.setSigningWith('resetPassword');
		sendPasswordResetEmail(this.afAuth, this.email)
			.then(() => {
				this.setSigningWith(undefined);
				this.showToast(`Password reset link has been sent to email: ${this.email}`);
			})
			.catch(
				this.errorHandler(
					'Failed to send password reset email',
					'FailedToSendPasswordResetEmail',
				),
			);
	}

	private sendVerificationEmail(userCredential: UserCredential): void {
		setTimeout(async () => {
			try {
				await sendEmailVerification(userCredential.user);
			} catch (e) {
				this.handleError(e, 'Failed to send verification email');
			}
		});
	}

	private onLoggedIn(userCredential: UserCredential): void {
		this.loggedIn.emit(userCredential);
	}

	private errorHandler(
		m: string,
		eventName?: string,
		eventParams?: { [key: string]: string },
	): (err: unknown) => void {
		return err => this.handleError(err, m, eventName, eventParams);
	}

	private handleError(
		err: unknown, m: string,
		eventName?: string,
		eventParams?: { [key: string]: string },
	): void {
		this.setSigningWith(undefined);
		if (eventName) {
			this.analyticsService.logEvent(eventName, eventParams);
		}
		if ((err as FirebaseError).code === 'auth/wrong-password') {
			console.log(err);
			this.wrongPassword = true;
			return;
		}
		this.errorLogger.logError(err, m, { report: !(err as { code: unknown }).code });
	}

	private setSigningWith(signingWith?: EmailFormSigningWith): void {
		this.signingWith = signingWith;
		this.signingWithChange.emit(signingWith);
	}

	signChanged(): void {
		this.setFocusToEmail();
	}

	ionViewDidEnter(): void {
		this.setFocusToEmail();
	}

	private setFocusToEmail(): void {
		this.setFocusToInput(this.emailInput);
	}

	private setFocusToTeamTitle(): void {
		this.setFocusToInput(this.teamTitleInput);
	}

}
