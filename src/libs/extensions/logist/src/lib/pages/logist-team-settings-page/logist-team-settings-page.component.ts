import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-logist-team-settings-page',
	templateUrl: 'logist-team-settings-page.component.html',
})
export class LogistTeamSettingsPageComponent extends TeamBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super('LogistTeamSettingsPageComponent', route, teamParams);
	}
}
