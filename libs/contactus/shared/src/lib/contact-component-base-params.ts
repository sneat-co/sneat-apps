import { Injectable, NgModule } from '@angular/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
	ContactService,
	ContactusSpaceService,
} from '@sneat/contactus-services';

@Injectable()
export class ContactComponentBaseParams {
	public readonly errorLogger = this.spaceParams.errorLogger;
	// public readonly navController = this.spaceParams.navController;
	public readonly userService = this.spaceParams.userService;
	public readonly spaceNavService = this.spaceParams.spaceNavService;

	constructor(
		public readonly spaceParams: SpaceComponentBaseParams,
		public readonly contactService: ContactService,
		public readonly contactusSpaceService: ContactusSpaceService,
	) {}
}

@NgModule({
	providers: [ContactComponentBaseParams, SpaceComponentBaseParams],
})
export class ContactComponentBaseParamsModule {}
