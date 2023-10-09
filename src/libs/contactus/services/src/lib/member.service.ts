import { Inject, Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { IBriefAndID, IContactBrief, IMemberBrief, trimNames } from "@sneat/dto";
import { TeamService } from '@sneat/team/services';
import { ContactService } from './contact-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAcceptPersonalInviteRequest,
	IAddTeamMemberResponse, IContactContext,
	ICreateTeamMemberRequest,
	ITeamContext,
} from '@sneat/team/models';
import { Observable } from 'rxjs';
import { ContactusTeamService } from './contactus-team.service';

// export const memberBriefFromDto = (id: string, dto: IMemberDto): IMemberBrief => ({ id, ...dto });
export const contactContextFromBrief = (contact: IBriefAndID<IContactBrief>, team: ITeamContext): IContactContext => ({
	...contact,
	team,
});


@Injectable({
	providedIn: 'root',
})
export class MemberService extends ContactService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		contactusTeamService: ContactusTeamService,
		sneatApiService: SneatApiService,
		userService: SneatUserService,
		private readonly teamService: TeamService,
	) {
		super(afs, sneatApiService, contactusTeamService, userService);
	}

	public acceptPersonalInvite(
		request: IAcceptPersonalInviteRequest,
		firebaseToken: string,
	): Observable<IMemberBrief> {
		console.log('MemberService.acceptPersonalInvite()');
		if (firebaseToken) {
			this.sneatApiService.setApiAuthToken(firebaseToken);
		}
		return this.sneatApiService.post(
			'invites/accept_personal_invite',
			request,
		);
	}

	public createMember(request: ICreateTeamMemberRequest): Observable<IAddTeamMemberResponse> {
		console.log(`MemberService.addMember()`, request);
		if (request.name) {
			request = { ...request, name: trimNames(request.name) };
		}
		return this.sneatApiService
			.post<IAddTeamMemberResponse>('contactus/create_member', request);
	}
}
