import { Component, OnInit, ViewChild } from '@angular/core';
import {
	ActivationStart,
	Router,
	RouterModule,
	RouterOutlet,
} from '@angular/router';
import { IonItem, IonLabel, IonList } from '@ionic/angular/standalone';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { SpaceBaseComponent } from '@sneat/space-components';
import { LogistSpaceMenuItemsComponent } from '../logist-team-menu-items/logist-space-menu-items.component';

@Component({
	selector: 'sneat-logist-space-menu',
	templateUrl: './logist-space-menu.component.html',
	imports: [
		RouterModule,
		AuthMenuItemComponent,
		LogistSpaceMenuItemsComponent,
		IonList,
		IonItem,
		IonLabel,
	],
})
export class LogistSpaceMenuComponent
	extends SpaceBaseComponent
	implements OnInit
{
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	constructor(private readonly router: Router) {
		super('LogistTeamMenuComponent');
	}

	override ngOnInit(): void {
		super.ngOnInit();
		this.router.events.subscribe((e) => {
			if (e instanceof ActivationStart && e.snapshot.outlet === 'menu') {
				this.outlet?.deactivate();
			}
		});
	}
}
