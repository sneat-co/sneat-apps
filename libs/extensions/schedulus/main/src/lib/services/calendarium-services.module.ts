import { NgModule } from '@angular/core';
import {
	CalendariumTeamService,
	ScheduleModalsService,
	ScheduleService,
} from '.';

@NgModule({
	providers: [CalendariumTeamService, ScheduleService, ScheduleModalsService],
})
export class CalendariumServicesModule {}
