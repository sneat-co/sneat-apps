import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { AuthProviderID, SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
import { SneatBaseComponent } from '@sneat/ui';
import { LoginWithTelegramComponent } from '../../pages/login-page/login-with-telegram.component';
import { UserAuthAProviderStatusComponent } from './user-auth-provider-status';

@Component({
	selector: 'sneat-user-auth-accounts',
	templateUrl: './user-auth-accounts.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		LoginWithTelegramComponent,
		FormsModule,
		UserAuthAProviderStatusComponent,
	],
})
export class UserAuthAccountsComponent extends SneatBaseComponent {
	protected readonly $userRecord = signal<IUserRecord | undefined>(undefined);

	protected readonly signingInWith = signal<AuthProviderID | undefined>(
		undefined,
	);

	constructor(
		private readonly sneatUserService: SneatUserService,
		private readonly sneatApiService: SneatApiService,
	) {
		super('UserAuthAccountsComponent');
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
