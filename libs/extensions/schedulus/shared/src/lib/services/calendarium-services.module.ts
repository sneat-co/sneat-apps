import { NgModule } from '@angular/core';
import { HappeningSlotModalService } from '../components/happening-slot-form/happening-slot-modal.service';
import { CalendarNavService } from './calendar-nav.service';
import { CalendariumSpaceService } from './calendarium-space.service';

@NgModule({
	providers: [
		CalendariumSpaceService,
		HappeningSlotModalService,
		CalendarNavService,
	],
})
export class CalendariumServicesModule {}
