import { Component } from '@angular/core';
import { TelegramAuthService } from '@sneat/auth-core';
import { TopMenuService } from '@sneat/core';

@Component({
	selector: 'sneat-app-root',
	templateUrl: 'sneat-app.component.html',
})
export class SneatAppComponent {
	constructor(
		readonly telegramAuthService: TelegramAuthService, // used in constructor
		protected readonly topMenuService: TopMenuService, // used in template
	) {
		telegramAuthService.authenticateIfTelegramWebApp();
	}
}
