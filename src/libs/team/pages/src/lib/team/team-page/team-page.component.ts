import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TeamBasePageDirective, TeamComponentBaseParams, TeamPageContextComponent } from '@sneat/team/components';

@Component({
	selector: 'sneat-team',
	templateUrl: './team-page.component.html',
})
export class TeamPageComponent extends TeamBasePageDirective implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamPageContextComponent;

	constructor(
		params: TeamComponentBaseParams,
		// readonly navService: TeamNavService,
	) {
		super('TeamPageComponent', params);
	}

	ngAfterViewInit(): void {
		if (this.teamPageContext)
			this.setTeamPageContext(this.teamPageContext);
		else
			this.logError('teamPageContext is not set');
	}
}
