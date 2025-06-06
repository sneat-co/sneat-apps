import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import {
	NavigationBehaviorOptions,
	NavigationEnd,
	Router,
	UrlTree,
} from '@angular/router';
import { NavController } from '@ionic/angular/standalone';

@Injectable({
	providedIn: 'root',
})
export class SneatNavService {
	private readonly router = inject(Router);
	private readonly location = inject(Location);
	private readonly navController = inject(NavController);

	private previous?: NavigationEnd;

	constructor() {
		const router = this.router;

		router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				this.previous = event;
			}
		});
	}

	goBack(url: string | UrlTree, extras?: NavigationBehaviorOptions): void {
		if (this.previous) {
			this.navController.pop().then((isPopped) => {
				if (!isPopped) {
					console.log('SneatNavService.goBack() - failed to pop');
					this.location.back();
				} else {
					console.log('SneatNavService.goBack() - popped');
				}
			});
		} else {
			console.log(
				'SneatNavService.goBack() - no previous page, navigating to',
				url,
			);
			this.router
				.navigateByUrl(url, extras)
				.catch((err) =>
					console.error('SneatNavService.goBack() - failed to navigate', err),
				);
		}
	}
}
