import { Component } from '@angular/core';
import { TopMenuService } from '@sneat/core';

declare const onTelegramScripLoaded: (() => void)[];

@Component({
	selector: 'sneat-app-root',
	templateUrl: 'sneat-app.component.html',
})
export class SneatAppComponent {
	constructor(protected readonly topMenuService: TopMenuService) {
		onTelegramScripLoaded.push(() => {
			(window as unknown as any).Telegram.WebApp.ready();
			// alert('SneatAppComponent notified that Telegram script has been loaded');
		});
	}
}
