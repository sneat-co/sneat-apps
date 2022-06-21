import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-express-team-menu',
	templateUrl: './express-team-menu.component.html',
})
export class ExpressTeamMenuComponent extends TeamBaseComponent implements OnInit {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly router: Router,
	) {
		super('ExpressTeamMenuComponent', route, teamParams);
	}


	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof ActivationStart && e.snapshot.outlet === 'menu')
				this.outlet?.deactivate();
		});
	}


}
