import { Injectable, NgModule } from '@angular/core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
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
		public readonly teamParams: SpaceComponentBaseParams,
		public readonly contactService: ContactService,
		public readonly contactusTeamService: ContactusTeamService,
	) {}
}

@NgModule({
	providers: [ContactComponentBaseParams, SpaceComponentBaseParams],
})
export class ContactComponentBaseParamsModule {}
