import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-express-main-page',
	templateUrl: './express-team-page.component.html',
	styleUrls: ['./express-team-page.component.scss'],
})
export class ExpressTeamPageComponent extends TeamBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super('', route, teamParams);
	}
}
