import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopMenuService } from '@sneat/core';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IContactContext, IContactusTeamDtoWithID, zipMapBriefsWithIDs } from '@sneat/team/models';

@Component({
	selector: 'sneat-team-page',
	templateUrl: './team-page.component.html',
	providers: [
		TeamComponentBaseParams,
	],
})
export class TeamPageComponent extends TeamBaseComponent implements OnDestroy {

	protected members?: IContactContext[];

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		public readonly topMenuService: TopMenuService,
		public readonly cd: ChangeDetectorRef,
		// readonly navService: TeamNavService,
	) {
		super('TeamPageComponent', route, params);
	}


	protected override onContactusTeamChanged(contactusTeam: IContactusTeamDtoWithID) {
		console.log('TeamPage.onContactusTeamChanged()', contactusTeam);
		super.onContactusTeamChanged(contactusTeam);
		this.members = zipMapBriefsWithIDs(contactusTeam?.dto?.contacts).map(c => ({ ...c, team: this.team }));
		console.log('TeamPage.onContactusTeamChanged() => this.members', this.members);
		this.cd.markForCheck();
	}
}
