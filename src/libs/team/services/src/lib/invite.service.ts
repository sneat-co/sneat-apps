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

	public createPersonalInvite(request: ICreatePersonalInviteRequest): Observable<ICreatePersonalInviteResponse> {
		const result: Observable<ICreatePersonalInviteResponse> = request.to.channel === 'link'
			? this.sneatApiService
				.get<ICreatePersonalInviteResponse>(
					`invites/get_invite_link_for_member?team=${request.teamID}&member=${request.to.memberID}`,
				)
			: this.sneatApiService
				.post<ICreatePersonalInviteResponse>(
					'invites/create_invite_for_member',
					request,
				);
		return result;
	}
}
