import { Inject, Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { trimNames } from '@sneat/auth-models';
import { IIdAndBrief } from '@sneat/core';
import {
	IContactBrief,
	IMemberBrief,
	IAcceptPersonalInviteRequest,
	IAddSpaceMemberResponse,
	ICreateSpaceMemberRequest,
} from '@sneat/contactus-core';
import { ContactService } from './contact-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ISpaceContext,
	ISpaceItemBriefWithSpaceRef,
} from '@sneat/space-models';
import { Observable } from 'rxjs';
import { ContactusSpaceService } from './contactus-space.service';

// export const memberBriefFromDto = (id: string, dto: IMemberDto): IMemberBrief => ({ id, ...dto });
export const contactContextFromBrief = (
	contact: IIdAndBrief<IContactBrief>,
	space: ISpaceContext,
): ISpaceItemBriefWithSpaceRef<IContactBrief> => ({
	...contact,
	space,
});

@Injectable()
export class MemberService extends ContactService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		contactusTeamService: ContactusSpaceService,
		sneatApiService: SneatApiService,
		userService: SneatUserService,
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
		return this.sneatApiService.post('invites/accept_personal_invite', request);
	}

	public createMember(
		request: ICreateSpaceMemberRequest,
	): Observable<IAddSpaceMemberResponse> {
		console.log(`MemberService.addMember()`, request);
		if (request.names) {
			request = { ...request, names: trimNames(request.names) };
		}
		return this.sneatApiService.post<IAddSpaceMemberResponse>(
			'contactus/create_member',
			request,
		);
	}
}
