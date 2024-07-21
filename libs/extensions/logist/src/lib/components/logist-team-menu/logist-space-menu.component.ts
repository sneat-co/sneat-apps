import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
	ActivatedRoute,
	ActivationStart,
	Router,
	RouterModule,
	RouterOutlet,
} from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemComponent } from '@sneat/components';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
	SpacesMenuComponent,
} from '@sneat/team-components';
import { LogistSpaceMenuItemsModule } from '../logist-team-menu-items/logist-space-menu-items.module';

@Component({
	standalone: true,
	selector: 'sneat-logist-space-menu',
	templateUrl: './logist-space-menu.component.html',
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemComponent,
		SpacesMenuComponent,
		LogistSpaceMenuItemsModule,
	],
})
export class LogistSpaceMenuComponent
	extends SpaceBaseComponent
	implements OnInit
{
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		private readonly router: Router,
	) {
		super('LogistTeamMenuComponent', route, teamParams);
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
