import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdAndBrief, IIdAndOptionalDto, TopMenuService } from '@sneat/core';
import {
	IContactusTeamDtoAndID,
	IContactBrief,
	IContactusTeamDto,
} from '@sneat/contactus-core';
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

	protected onContactusTeamChanged(contactusTeam: IContactusTeamDtoAndID) {
		console.log('TeamPage.onContactusTeamChanged()', contactusTeam);
		// super.onContactusTeamChanged(contactusTeam);
		this.members = zipMapBriefsWithIDs(contactusTeam?.dto?.contacts)
			.filter((c) => c.brief?.roles?.includes('member'))
			.map((c) => ({ ...c, team: this.team }));
		console.log(
			'TeamPage.onContactusTeamChanged() => this.members',
			this.members,
		);
		this.cd.markForCheck();
	}
}
