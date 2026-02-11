import {
  ChangeDetectionStrategy,
  Component,
  signal,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import { AuthProviderID, SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
import { ClassName, SneatBaseComponent } from '@sneat/ui';
import { LoginWithTelegramComponent } from '../../pages/login-page/login-with-telegram.component';
import { UserAuthAProviderStatusComponent } from './user-auth-provider-status';

@Component({
  selector: 'sneat-user-auth-accounts',
  templateUrl: './user-auth-accounts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoginWithTelegramComponent,
    FormsModule,
    UserAuthAProviderStatusComponent,
    IonCard,
    IonList,
    IonItemDivider,
    IonLabel,
    IonItem,
    IonIcon,
    IonText,
    IonButtons,
    IonButton,
    IonCardContent,
  ],
  providers: [
    {
      provide: ClassName,
      useValue: 'UserAuthAccountsComponent',
    },
  ],
})
export class UserAuthAccountsComponent extends SneatBaseComponent {
  private readonly sneatUserService = inject(SneatUserService);
  private readonly sneatApiService = inject(SneatApiService);

  protected readonly $userRecord = signal<IUserRecord | undefined>(undefined);

  protected readonly signingInWith = signal<AuthProviderID | undefined>(
    undefined,
  );

  constructor() {
    super();
    this.sneatUserService.userState.pipe(this.takeUntilDestroyed()).subscribe({
      next: (user) => {
        this.$userRecord.set(user.record || undefined);
      },
    });
  }

  protected hasAccount(provider: 'telegram' | 'viber' | 'whatsapp'): boolean {
    provider = provider + ':';
    for (const account of this.$userRecord()?.accounts || []) {
      if (account.startsWith(provider)) {
        return true;
      }
    }
    return false;
  }

  protected getAccountID(provider: 'telegram'): string {
    const prefix = provider + '::';
    const a = this.$userRecord()?.accounts?.find((a) => a.startsWith(prefix));
    return a?.replace(prefix, '') || '';
  }

  protected disconnecting?: 'telegram' | 'viber' | 'whatsapp';

  protected disconnect(provider: 'telegram'): void {
    if (
      !confirm(
        'Are you sure you want to disconnect Telegram login from your account?',
      )
    ) {
      return;
    }
    this.disconnecting = provider;
    this.sneatApiService
      .delete('auth/disconnect?provider=' + provider)
      .subscribe({
        next: () => {
          this.disconnecting = undefined;
          alert('Disconnected!');
        },
        error: this.errorLogger.logErrorHandler('Failed to disconnect'),
      });
  }
}
