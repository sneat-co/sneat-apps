import { Injectable } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ContactService } from './services';

@Injectable()
export class ContactComponentBaseParams {

	public readonly errorLogger = this.teamParams.errorLogger;
	public readonly navController = this.teamParams.navController;
	public readonly userService = this.teamParams.userService;
	public readonly teamNavService = this.teamParams.teamNavService;

	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly contactService: ContactService,
	) {
	}

}
