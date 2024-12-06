import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { LogistSpaceService } from '../../services/logist-space.service';
import { LogistSpaceBaseComponent } from '../logist-space-base.component';

@Component({
	selector: 'sneat-logist-main-page',
	templateUrl: './logist-space-page.component.html',
	standalone: false,
})
export class LogistSpacePageComponent extends LogistSpaceBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		logistTeamService: LogistSpaceService,
	) {
		super('LogistSpacePageComponent', route, teamParams, logistTeamService);
	}
}
