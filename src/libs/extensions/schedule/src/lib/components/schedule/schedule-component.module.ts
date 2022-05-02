import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterItemModule, MembersAsBadgesModule, SneatPipesModule } from '@sneat/components';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { HappeningServiceModule } from '../../services/happening.service';
import { DaySlotItemComponent } from '../day-slot-item/day-slot-item.component';
import { RecurringCardComponent } from '../recurrings-tab/recurring-card.component';
import { RecurringsTabComponent } from '../recurrings-tab/recurrings-tab.component';
import { ScheduleCardHeaderComponent } from '../schedule-card-hearder/schedule-card-header.component';
import { ScheduleDayCardComponent } from '../schedule-day/schedule-day-card.component';
import { ScheduleDayTabComponent } from '../schedule-day/schedule-day-tab.component';
import { ScheduleDayTitleComponent } from '../schedule-day/schedule-day-title.component';
import { ScheduleDayComponent } from '../schedule-day/schedule-day.component';
import { ScheduleFilterService } from '../schedule-filter.service';
import { ScheduleFilterComponent } from '../schedule-filter/schedule-filter.component';
import { ScheduleStateService } from '../schedule-state.service';
import { ScheduleWeekComponent } from '../schedule-week/schedule-week.component';
import { ScheduleWeekdayComponent } from '../schedule-weekday/schedule-weekday.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { SinglesTabComponent } from '../singles-tab/singles-tab.component';
import { ScheduleWeekCardComponent } from '../week-tab/schedule-week-card.component';
import { ScheduleWeekTabComponent } from '../week-tab/schedule-week-tab.component';
import { ScheduleWeekTitleComponent } from '../week-tab/schedule-week-title.component';


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
		RecurringCardComponent,
		SinglesTabComponent,
		ScheduleDayCardComponent,
		ScheduleDayTabComponent,
		ScheduleDayTitleComponent,
		ScheduleWeekTabComponent,
		ScheduleWeekCardComponent,
		ScheduleWeekTitleComponent,
		ScheduleFilterComponent,
		ScheduleCardHeaderComponent,
	],
	providers: [
		ScheduleFilterService,
		ScheduleStateService,
	],
})
export class ScheduleComponentModule {

}
