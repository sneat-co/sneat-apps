import { NgModule } from '@angular/core';
import { HappeningSlotModalService } from '../components/happening-slot-form/happening-slot-modal.service';
import { CalendariumTeamService } from './calendarium-team.service';

@NgModule({
	providers: [CalendariumTeamService, HappeningSlotModalService],
})
export class CalendariumServicesModule {}
