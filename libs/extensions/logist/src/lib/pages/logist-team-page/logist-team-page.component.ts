import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { LogistTeamService } from '../../services/logist-team.service';
import { LogistTeamBaseComponent } from '../logist-team-base.component';

@Component({
	selector: 'sneat-logist-main-page',
	templateUrl: './logist-team-page.component.html',
})
export class LogistTeamPageComponent extends LogistTeamBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		logistTeamService: LogistTeamService,
	) {
		super('LogistTeamPageComponent', route, teamParams, logistTeamService);
	}
}
