import { Inject, Injectable } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreatePersonalInviteRequest, ICreatePersonalInviteResponse } from '@sneat/team/models';

@Injectable({
	providedIn: 'root',
})
export class InviteService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatApiService: SneatApiService,
	) {
	}

	public CreatePersonalInvite(request: ICreatePersonalInviteRequest) {
		return this.sneatApiService
			.post<ICreatePersonalInviteResponse>(
				'invites/create_invite_for_member',
				request,
			);
	}
}
