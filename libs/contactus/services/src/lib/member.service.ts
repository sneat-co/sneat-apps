import { Inject, Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { trimNames } from '@sneat/auth-models';
import {
	IMemberBrief,
	IAcceptPersonalInviteRequest,
	IAddSpaceMemberResponse,
	ICreateSpaceMemberRequest,
	validateCreateSpaceMemberRequest,
} from '@sneat/contactus-core';
import { ContactService } from './contact-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Observable } from 'rxjs';
import { ContactusSpaceService } from './contactus-space.service';

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
		validateCreateSpaceMemberRequest(request);
		return this.sneatApiService.post<IAddSpaceMemberResponse>(
			'contactus/create_member',
			request,
		);
	}
}
