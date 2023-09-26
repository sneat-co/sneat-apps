import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthMenuItemComponent } from '@sneat/components';
import { TeamBaseComponent, TeamComponentBaseParams, TeamsMenuComponent } from '@sneat/team/components';
import { LogistTeamMenuItemsModule } from '../logist-team-menu-items/logist-team-menu-items.module';

@Component({
	standalone: true,
	selector: 'sneat-logist-team-menu',
	templateUrl: './logist-team-menu.component.html',
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		AuthMenuItemComponent,
		TeamsMenuComponent,
		LogistTeamMenuItemsModule,
	],
})
export class LogistTeamMenuComponent extends TeamBaseComponent implements OnInit {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly router: Router,
	) {
		super('LogistTeamMenuComponent', route, teamParams);
	}


	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof ActivationStart && e.snapshot.outlet === 'menu')
				this.outlet?.deactivate();
		});
	}


}
