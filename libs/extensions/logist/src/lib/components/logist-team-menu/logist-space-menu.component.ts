import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
	ActivationStart,
	Router,
	RouterModule,
	RouterOutlet,
} from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemComponent } from '@sneat/components';
import { SpaceBaseComponent } from '@sneat/space-components';
import { LogistSpaceMenuItemsModule } from '../logist-team-menu-items/logist-space-menu-items.module';

@Component({
	selector: 'sneat-logist-space-menu',
	templateUrl: './logist-space-menu.component.html',
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemComponent,
		LogistSpaceMenuItemsModule,
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
