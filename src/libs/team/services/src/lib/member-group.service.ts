import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatFirestoreService } from '@sneat/api';
import { IMemberGroupBrief, IMemberGroupDto } from '@sneat/dto';
import { IMemberGroupContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable } from 'rxjs';

const dto2brief = (id: string, dto: IMemberGroupDto) => ({ id, title: dto.title });

@Injectable({
	providedIn: 'root',
})
export class MemberGroupService {

	private readonly sfs: SneatFirestoreService<IMemberGroupBrief, IMemberGroupDto>;

	constructor(
		afs: AngularFirestore,
		private readonly teamItemBaseService: TeamItemBaseService,
	) {
		this.sfs = new SneatFirestoreService<IMemberGroupBrief, IMemberGroupDto>(
			'team_member_groups', afs, dto2brief);
	}

	watchMemberGroupsByTeamID<IMemberGroupDto>(teamID: string): Observable<IMemberGroupContext[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.sfs.watchByTeamID(teamID, 'teamID');
	}
}
