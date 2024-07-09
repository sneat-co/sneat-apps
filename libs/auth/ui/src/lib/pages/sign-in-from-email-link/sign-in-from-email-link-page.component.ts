import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	signal,
} from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Component({
	selector: 'sneat-sign-in-from-email-link-page',
	templateUrl: 'sign-in-from-email-link-page.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFromEmailLinkPageComponent {
	protected readonly email = signal('');
	protected readonly emailFromStorage = signal(false);
	protected readonly isSigning = signal(false);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly authStateService: SneatAuthStateService,
		private readonly navController: NavController,
	) {
		this.email.set(localStorage.getItem('emailForSignIn') || '');
		this.emailFromStorage.set(!!this.email);
		if (this.email()) {
			this.signIn();
		}
	}

	public signIn(): void {
		this.isSigning.set(true);
		this.authStateService.signInWithEmailLink(this.email()).subscribe({
			next: () => {
				this.navController
					.navigateRoot('/')
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to navigate to root page after signing in with email link',
						),
					);
			},
			error: (err) => {
				this.isSigning.set(false);
				this.emailFromStorage.set(false);
				this.errorLogger.logError(err, 'Failed to sign in with email link');
			},
		});
	}
}
