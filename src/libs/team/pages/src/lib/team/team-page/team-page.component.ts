import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TeamBasePage, TeamComponentBaseParams, TeamContextComponent } from '@sneat/team/components';

@Component({
	selector: 'sneat-team',
	templateUrl: './team-page.component.html',
})
export class TeamPageComponent extends TeamBasePage implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamContextComponent;

	constructor(
		params: TeamComponentBaseParams,
		// readonly navService: TeamNavService,
	) {
		super('TeamPageComponent', params);
	}

	ngAfterViewInit(): void {
		this.setTeamPageContext(this.teamPageContext);
	}
}
