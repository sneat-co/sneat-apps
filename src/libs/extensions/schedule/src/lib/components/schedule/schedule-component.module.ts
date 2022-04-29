import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterItemModule, SneatPipesModule } from '@sneat/components';
import { MembersAsBadgesModule } from '@sneat/core';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { HappeningServiceModule } from '../../services/happening.service';
import { DaySlotItemComponent } from '../day-slot-item/day-slot-item.component';
import { RecurringsTabComponent } from '../recurrings-tab/recurrings-tab.component';
import { ScheduleDayComponent } from '../schedule-day/schedule-day.component';
import { ScheduleFilterComponent } from '../schedule-filter/schedule-filter.component';
import { ScheduleWeekComponent } from '../schedule-week/schedule-week.component';
import { ScheduleWeekdayComponent } from '../schedule-weekday/schedule-weekday.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { SinglesTabComponent } from '../singles-tab/singles-tab.component';


@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatPipesModule,
		TeamCoreComponentsModule,
		FilterItemModule,
		HappeningServiceModule,
		ReactiveFormsModule,
		MembersAsBadgesModule,
	],
	exports: [
		ScheduleComponent,
	],
	declarations: [
		ScheduleComponent,
		DaySlotItemComponent,
		ScheduleDayComponent,
		ScheduleWeekComponent,
		ScheduleWeekdayComponent,
		RecurringsTabComponent,
		SinglesTabComponent,
		ScheduleFilterComponent,
	],
})
export class ScheduleComponentModule {

}
