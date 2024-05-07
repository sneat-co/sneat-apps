import { NgModule } from '@angular/core';
import { CalendariumTeamService } from './calendarium-team.service';
import { CalendarModalsService } from './calendar-modals.service';

@NgModule({
	providers: [CalendariumTeamService, CalendarModalsService],
})
export class CalendariumServicesModule {}
