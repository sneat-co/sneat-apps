import { Injectable, NgModule, inject } from '@angular/core';
import { CalendariumSpaceService } from '../services/calendarium-space.service';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { HappeningService } from '../services/happening.service';

@Injectable()
export class HappeningComponentBaseParams {
  readonly spaceParams = inject(SpaceComponentBaseParams);
  readonly happeningService = inject(HappeningService);
  readonly calendariumSpaceService = inject(CalendariumSpaceService);
}

@NgModule({
  providers: [
    HappeningComponentBaseParams,
    SpaceComponentBaseParams,
    CalendariumSpaceService,
  ],
})
export class HappeningComponentBaseParamsModule {}
