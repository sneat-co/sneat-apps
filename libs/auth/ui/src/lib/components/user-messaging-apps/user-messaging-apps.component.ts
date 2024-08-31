import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
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

	constructor(private readonly sneatUserService: SneatUserService) {
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
}
