import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutingState {
	private history: string[] = [];

	constructor(
		router: Router,
	) {
		router.events
			.subscribe({
				next: event => {
					if (event instanceof NavigationEnd) {
						this.history = [...this.history, event.urlAfterRedirects];
						if (this.history.length > 2) {
							this.history.slice(this.history.length - 2, this.history.length);
						}
					}
				},
			});
	}

	public hasHistory(): boolean {
		return this.history.length > 1;
	}
}
