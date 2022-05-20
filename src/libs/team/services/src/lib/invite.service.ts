import { Inject, Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreatePersonalInviteRequest, ICreatePersonalInviteResponse } from '@sneat/team/models';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class InviteService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatApiService: SneatApiService,
	) {
	}

	public createInviteForMember(request: ICreatePersonalInviteRequest): Observable<ICreatePersonalInviteResponse> {
		return this.sneatApiService
			.post<ICreatePersonalInviteResponse>(
				'invites/create_invite_for_member',
				request,
			);
	}

	public getInviteLinkForMember(request: ICreatePersonalInviteRequest): Observable<ICreatePersonalInviteResponse> {
		return this.sneatApiService
			.get<ICreatePersonalInviteResponse>(
				`invites/invite_link_for_member?team=${request.teamID}&member=${request.to.memberID}`,
			);
	}
}
