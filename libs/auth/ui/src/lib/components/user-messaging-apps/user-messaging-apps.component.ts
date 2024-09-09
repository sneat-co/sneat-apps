import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { LoginWithTelegramComponent } from '../../pages/login-page/login-with-telegram.component';

@Component({
	selector: 'sneat-user-messaging-apps',
	templateUrl: './user-messaging-apps.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, LoginWithTelegramComponent, FormsModule],
})
export class UserMessagingAppsComponent {
	protected integrations: 'messaging-apps' | 'quick-logins' = 'messaging-apps';

	protected userRecord?: IUserRecord;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatUserService: SneatUserService,
		private readonly sneatApiService: SneatApiService,
	) {
		this.sneatUserService.userState.subscribe({
			next: (user) => {
				this.userRecord = user.record || undefined;
			},
		});
	}

	protected hasAccount(provider: 'telegram' | 'viber' | 'whatsapp'): boolean {
		provider = provider + ':';
		for (const account of this.userRecord?.accounts || []) {
			if (account.startsWith(provider)) {
				return true;
			}
		}
		return false;
	}

	protected getAccountID(provider: 'telegram'): string {
		const prefix = provider + '::';
		const a = this.userRecord?.accounts?.find((a) => a.startsWith(prefix));
		return a?.replace(prefix, '') || '';
	}

	protected disconnecting?: 'telegram' | 'viber' | 'whatsapp';

	protected disconnect(provider: 'telegram'): void {
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
