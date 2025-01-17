import { Injectable, NgModule } from '@angular/core';
import { CalendariumSpaceService } from '../services';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { HappeningService } from '../..';

@Injectable()
export class HappeningComponentBaseParams {
	constructor(
		public readonly spaceParams: SpaceComponentBaseParams,
		public readonly happeningService: HappeningService,
		public readonly calendariumSpaceService: CalendariumSpaceService,
	) {}
}

@NgModule({
	providers: [
		HappeningComponentBaseParams,
		SpaceComponentBaseParams,
		CalendariumSpaceService,
	],
})
export class HappeningComponentBaseParamsModule {}
