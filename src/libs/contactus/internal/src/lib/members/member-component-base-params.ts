import { Injectable } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { MemberService } from '@sneat/contactus-services';

@Injectable()
export class MemberComponentBaseParams {

	public readonly errorLogger = this.teamParams.errorLogger;
	public readonly navController = this.teamParams.navController;
	public readonly userService = this.teamParams.userService;
	public readonly teamNavService = this.teamParams.teamNavService;

	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly memberService: MemberService,
	) {
	}

}
