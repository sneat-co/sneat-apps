import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

@Component({
  selector: 'sneat-sign-in-from-email-link-page',
  templateUrl: 'sign-in-from-email-link-page.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonLabel,
  ],
})
export class SignInFromEmailLinkPageComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly authStateService = inject(SneatAuthStateService);
  private readonly navController = inject(NavController);

  email: string;
  emailFromStorage = false;
  isSigning = false;

  constructor() {
    this.email = localStorage.getItem('emailForSignIn') || '';
    this.emailFromStorage = !!this.email;
    if (this.email) {
      this.signIn();
    }
  }

  public signIn(): void {
    this.isSigning = true;
    this.authStateService.signInWithEmailLink(this.email).subscribe({
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
        this.isSigning = false;
        this.emailFromStorage = false;
        this.errorLogger.logError(err, 'Failed to sign in with email link');
      },
    });
  }
}
