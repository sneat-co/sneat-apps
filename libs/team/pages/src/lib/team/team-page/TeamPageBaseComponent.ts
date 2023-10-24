import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IIdAndBrief, TopMenuService } from '@sneat/core';
import { IContactBrief } from '@sneat/dto';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import {
	IContactusTeamDtoAndID,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';

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

	protected override onContactusTeamChanged(
		contactusTeam: IContactusTeamDtoAndID,
	) {
		console.log('TeamPage.onContactusTeamChanged()', contactusTeam);
		super.onContactusTeamChanged(contactusTeam);
		this.members = zipMapBriefsWithIDs(contactusTeam?.dto?.contacts)
			.filter((c) => c.brief?.roles?.includes('member'))
			.map((c) => ({ ...c, team: this.team }));
		console.log(
			'TeamPage.onContactusTeamChanged() => this.members',
			this.members,
		);
		this.cd.markForCheck();
	}

	protected goMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.teamParams.teamNavService
			.navigateForwardToTeamPage(this.team, 'members', {
				state: {
					contactusTeam: this.contactusTeam,
				},
			})
			.catch(console.error);
	}
}
