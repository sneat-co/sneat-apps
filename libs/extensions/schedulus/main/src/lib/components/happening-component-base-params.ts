import { Injectable, NgModule } from '@angular/core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { HappeningService } from '@sneat/team-services';

@Injectable()
export class HappeningComponentBaseParams {
	constructor(
		public readonly spaceParams: SpaceComponentBaseParams,
		public readonly happeningService: HappeningService,
	) {}
}

@NgModule({
	providers: [HappeningComponentBaseParams, SpaceComponentBaseParams],
})
export class HappeningComponentBaseParamsModule {}
