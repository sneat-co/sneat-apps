import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdAndBrief, TopMenuService } from '@sneat/core';
import { IContactusSpaceDboAndID, IContactBrief } from '@sneat/contactus-core';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import { zipMapBriefsWithIDs } from '@sneat/team-models';

export abstract class TeamPageBaseComponent
	extends TeamBaseComponent
	implements OnDestroy
{
	protected members?: readonly IIdAndBrief<IContactBrief>[]; // TODO: Should be in dedicated component

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		protected readonly topMenuService: TopMenuService,
		protected readonly cd: ChangeDetectorRef, // readonly navService: TeamNavService,
	) {
		super(className, route, params);
	}

	protected onContactusTeamChanged(contactusTeam: IContactusSpaceDboAndID) {
		console.log('TeamPage.onContactusTeamChanged()', contactusTeam);
		// super.onContactusTeamChanged(contactusTeam);
		this.members = zipMapBriefsWithIDs(contactusTeam?.dbo?.contacts)
			.filter((c) => c.brief?.roles?.includes('member'))
			.map((c) => ({ ...c, team: this.space }));
		console.log(
			'TeamPage.onContactusTeamChanged() => this.members',
			this.members,
		);
		this.cd.markForCheck();
	}
}
