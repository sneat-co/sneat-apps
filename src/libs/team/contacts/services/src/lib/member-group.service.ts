import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IContactGroupBrief, IContactGroupDto } from '@sneat/dto';
import { IMemberGroupContext, ITeamContext } from '@sneat/team/models';
import { TeamItemService } from '@sneat/team/services';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MemberGroupService {

	private readonly teamItemService: TeamItemService<IContactGroupBrief, IContactGroupDto>;

	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService<IContactGroupBrief, IContactGroupDto>(
			'team_member_groups', afs, sneatApiService);
	}

	watchMemberGroupsByTeam(team: ITeamContext, status: 'active' | 'archived' = 'active'): Observable<IMemberGroupContext[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.teamItemService.watchTeamItems(team, [{ field: 'status', operator: '==', value: status }]);
	}
}
