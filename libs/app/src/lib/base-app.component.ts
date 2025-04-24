import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TelegramAuthService } from '@sneat/auth-core';
import { AnalyticsService, TopMenuService } from '@sneat/core';
import { filter } from 'rxjs';

export class BaseAppComponent {
	private readonly telegramAuthService = inject(TelegramAuthService);
	private readonly router = inject(Router);
	private readonly activatedRoute = inject(ActivatedRoute);
	private readonly analyticsService = inject(AnalyticsService);
	private readonly titleService = inject(Title);
	protected readonly topMenuService = inject(TopMenuService); // used in templates

	constructor() {
		this.telegramAuthService.authenticateIfTelegramWebApp();
		this.router.events
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
				this.analyticsService.logEvent('$pageview', {
					page_path: event.urlAfterRedirects,
					title,
				});
				title = title ? `${title} @ Sneat.App` : 'Sneat.App'; // Default title
				this.titleService.setTitle(title);
			});
	}
}

function capitalizeFirstLetter(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
