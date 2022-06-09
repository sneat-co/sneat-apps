import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonInput, ToastController } from '@ionic/angular';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import { SneatApiService } from '@sneat/api';
import { IInitUserRecordRequest, UserRecordService } from '@sneat/auth';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { RandomIdService } from '@sneat/random';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;

export type EmailFormSigningWith = 'email' | 'emailLink' | 'resetPassword';

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

	signingWith?: EmailFormSigningWith;

	@Output() readonly signingWithChange = new EventEmitter<EmailFormSigningWith | undefined>();
	@Output() readonly loggedIn = new EventEmitter<UserCredential>();

	@ViewChild('emailInput', { static: true }) emailInput?: IonInput;

	constructor(
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

	public async signUp(): Promise<void> {
		if (!this.firstName) {
			// this.toaster.showToast('Full name is required');
			return;
		}
		this.setSigningWith('email');
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
		localStorage.setItem('emailForSignIn', email);
		const password = this.randomIdService.newRandomId({ len: 9 });
		try {
			const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
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
					};
					this.userRecordService.initUserRecord(request).subscribe({
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
		this.setSigningWith('emailLink');
		this.email = this.email.trim();
		localStorage.setItem('emailForSignIn', this.email);
		this.afAuth
			.sendSignInLinkToEmail(this.email, {
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
			buttons: [{icon: 'close', role: 'cancel'}]
		}).then(toast => {
			toast.present().catch(this.errorLogger.logErrorHandler('Failed to present toast about password reset email sent success'));
		});

	}

	public resetPassword(): void {
		this.setSigningWith('resetPassword');
		this.afAuth
			.sendPasswordResetEmail(this.email)
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
				await userCredential.user?.sendEmailVerification();
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
		this.setSigningWith(undefined);
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
		this.emailInput?.setFocus()
			.catch(err => this.errorLogger.logError(err, 'Failed to set focus to email input'));
	}

}
