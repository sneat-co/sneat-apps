import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TopMenuService } from '@sneat/core';
import { TeamBasePage, TeamComponentBaseParams, TeamContextComponent } from '@sneat/team/components';

@Component({
	selector: 'sneat-team',
	templateUrl: './team-page.component.html',
	providers: [
		TeamComponentBaseParams,
	]
})
export class TeamPageComponent extends TeamBasePage implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamContextComponent;

	constructor(
		params: TeamComponentBaseParams,
		public readonly topMenuService: TopMenuService,
		// readonly navService: TeamNavService,
	) {
		super('TeamPageComponent', params);
	}

	ngAfterViewInit(): void {
		this.setTeamPageContext(this.teamPageContext);
	}
}
