import { Injectable, NgModule } from '@angular/core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import {
	ContactService,
	ContactusTeamService,
} from '@sneat/contactus-services';

@Injectable()
export class ContactComponentBaseParams {
	public readonly errorLogger = this.teamParams.errorLogger;
	public readonly navController = this.teamParams.navController;
	public readonly userService = this.teamParams.userService;
	public readonly teamNavService = this.teamParams.teamNavService;

	constructor(
		public readonly teamParams: TeamComponentBaseParams,
		public readonly contactService: ContactService,
		public readonly contactusTeamService: ContactusTeamService,
	) {}
}

@NgModule({
	providers: [ContactComponentBaseParams, TeamComponentBaseParams],
})
export class ContactComponentBaseParamsModule {}
