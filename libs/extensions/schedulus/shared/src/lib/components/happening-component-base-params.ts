import { Injectable, NgModule } from '@angular/core';
import { CalendariumSpaceService } from '../services/calendarium-space.service';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { HappeningService } from '../services/happening.service';

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
