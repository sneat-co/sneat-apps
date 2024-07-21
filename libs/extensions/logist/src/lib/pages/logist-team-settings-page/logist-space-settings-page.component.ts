import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { LogistSpaceService } from '../../services';
import { LogistSpaceBaseComponent } from '../logist-space-base.component';

@Component({
	selector: 'sneat-logist-space-settings-page',
	templateUrl: 'logist-space-settings-page.component.html',
})
export class LogistSpaceSettingsPageComponent extends LogistSpaceBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		logistTeamService: LogistSpaceService,
	) {
		super(
			'LogistTeamSettingsPageComponent',
			route,
			teamParams,
			logistTeamService,
		);
	}
}
