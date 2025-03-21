import { Component, Inject, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TelegramAuthService } from '@sneat/auth-core';
import {
	AnalyticsService,
	IAnalyticsService,
	TopMenuService,
} from '@sneat/core';
import { filter } from 'rxjs';

function capitalizeFirstLetter(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

@Component({
	selector: 'sneat-app-root',
	templateUrl: 'sneat-app.component.html',
	standalone: false,
	// imports: [IonicModule],
	providers: [TelegramAuthService],
})
export class SneatAppComponent {
	// private analyticsService = inject(AnalyticsService);
	private titleService = inject(Title);
	private activatedRoute = inject(ActivatedRoute);

	constructor(
		readonly telegramAuthService: TelegramAuthService, // used in constructor
		protected readonly topMenuService: TopMenuService, // used in template
		router: Router,
		@Inject(AnalyticsService) analyticsService: IAnalyticsService,
	) {
		telegramAuthService.authenticateIfTelegramWebApp();
		router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe((event: NavigationEnd) => {
				let route = this.activatedRoute.firstChild;
				while (route?.firstChild) {
					route = route.firstChild;
				}
				let title = route?.snapshot.data['title'];
				if (title) {
					const spaceType = route?.snapshot?.paramMap?.get('spaceType');
					if (spaceType) {
						title = `${capitalizeFirstLetter(spaceType)} ${title}`;
					}
				}
				analyticsService.logEvent('$pageview', {
					page_path: event.urlAfterRedirects,
					title,
				});
				title = title ? `${title} @ Sneat.App` : 'Sneat.App'; // Default title
				this.titleService.setTitle(title);
			});
	}
}
