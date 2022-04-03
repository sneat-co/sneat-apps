import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopMenuService } from '@sneat/core';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-team-page',
	templateUrl: './team-page.component.html',
	providers: [
		TeamComponentBaseParams,
	],
})
export class TeamPageComponent extends TeamBaseComponent {

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		public readonly topMenuService: TopMenuService,
		// readonly navService: TeamNavService,
	) {
		super('TeamPageComponent', route, params);
	}
}
