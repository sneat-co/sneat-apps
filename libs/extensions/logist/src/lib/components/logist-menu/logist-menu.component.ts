import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
	ActivationStart,
	Router,
	RouterModule,
	RouterOutlet,
} from '@angular/router';
import { IonList } from '@ionic/angular/standalone';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';
import { AppVersionComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/space-components';
import { AuthMenuItemComponent } from '@sneat/auth-ui';

@Component({
	selector: 'sneat-logist-menu',
	templateUrl: './logist-menu.component.html',
	imports: [
		RouterModule,
		AuthMenuItemComponent,
		SpacesMenuComponent,
		AppVersionComponent,
		IonList,
	],
})
export class LogistMenuComponent implements OnInit {
	private readonly router = inject(Router);
	private readonly authStateService = inject(SneatAuthStateService);

	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	public authState?: ISneatAuthState;

	constructor() {
		const authStateService = this.authStateService;

		authStateService.authState.subscribe((authState) => {
			this.authState = authState;
		});
	}

	ngOnInit(): void {
		this.router.events.subscribe((e) => {
			if (e instanceof ActivationStart && e.snapshot.outlet === 'menu')
				this.outlet?.deactivate();
		});
	}
}

@Component({
	selector: 'sneat-logist-menu-lazy',
	template: ` <sneat-logist-menu />`,
	imports: [LogistMenuComponent],
})
export class LogistMenuLazyComponent {}
