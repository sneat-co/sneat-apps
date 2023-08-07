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
export class MemberGroupService { // TODO: Move to ContactGroupService or delete


}
