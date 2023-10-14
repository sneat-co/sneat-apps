import { Component, OnDestroy } from '@angular/core';
import { AuthStatus, SneatAuthStateService } from '@sneat/auth-core';
import { Subject, takeUntil } from 'rxjs';

@Component({
	// Do not make it standalone component,
	// as it requires few other components specific just to this page
	selector: 'sneat-sneat-app-home-page',
	templateUrl: './sneat-app-home-page.component.html',
})
export class SneatAppHomePageComponent implements OnDestroy {
	readonly destroyed = new Subject<void>();

	public authStatus?: AuthStatus;

	constructor(authStateService: SneatAuthStateService) {
		authStateService.authState.pipe(takeUntil(this.destroyed)).subscribe({
			next: (authState) => {
				this.authStatus = authState.status;
			},
		});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
