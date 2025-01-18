import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
	ActivationStart,
	Router,
	RouterModule,
	RouterOutlet,
} from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';
import { AppVersionComponent, AuthMenuItemComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/team-components';

@Component({
	selector: 'sneat-logist-menu',
	templateUrl: './logist-menu.component.html',
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemComponent,
		SpacesMenuComponent,
		AppVersionComponent,
	],
})
export class LogistMenuComponent implements OnInit {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	public authState?: ISneatAuthState;

	constructor(
		private readonly router: Router,
		private readonly authStateService: SneatAuthStateService,
	) {
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
