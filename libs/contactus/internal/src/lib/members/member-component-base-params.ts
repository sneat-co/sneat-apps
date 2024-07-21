import { Injectable } from '@angular/core';
import { ContactComponentBaseParams } from '@sneat/contactus-shared';
import { ContactService, MemberService } from '@sneat/contactus-services';

@Injectable()
export class MemberComponentBaseParams extends ContactComponentBaseParams {
	constructor(
		public readonly contactParams: ContactComponentBaseParams,
		public readonly memberService: MemberService,
	) {
		super(
			contactParams.spaceParams,
			contactParams.contactService,
			contactParams.contactusSpaceService,
		);
	}
}
