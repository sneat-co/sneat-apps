import { Injectable } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { MemberService } from '@sneat/team/services';

@Injectable()
export class MemberComponentBaseParams {
	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly memberService: MemberService,
	) {
	}
}
