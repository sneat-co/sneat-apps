import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-logist-team-menu',
	templateUrl: './logist-team-menu.component.html',
})
export class LogistTeamMenuComponent extends TeamBaseComponent implements OnInit {
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
