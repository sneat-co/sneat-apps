import { NgModule } from '@angular/core';
import { CalendariumTeamService, ScheduleModalsService } from '.';

@NgModule({
	providers: [CalendariumTeamService, ScheduleModalsService],
})
export class CalendariumServicesModule {}
