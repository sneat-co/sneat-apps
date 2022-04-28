import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterItemModule, SneatPipesModule } from '@sneat/components';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { HappeningServiceModule } from '../../services/happening.service';
import { RecurringsTabComponent } from '../recurrings-tab/recurrings-tab.component';
import { ScheduleDayComponent } from '../schedule-day/schedule-day.component';
import { ScheduleFilterComponent } from '../schedule-filter/schedule-filter.component';
import { ScheduleWeekComponent } from '../schedule-week/schedule-week.component';
import { ScheduleWeekdayComponent } from '../schedule-weekday/schedule-weekday.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { SinglesTabComponent } from '../singles-tab/singles-tab.component';
import { SlotItemComponent } from '../slot-item/slot-item.component';


@NgModule({
	exports: [
		ScheduleComponent,
	],
	declarations: [
		ScheduleComponent,
		SlotItemComponent,
		ScheduleDayComponent,
		ScheduleWeekComponent,
		ScheduleWeekdayComponent,
		RecurringsTabComponent,
		SinglesTabComponent,
		ScheduleFilterComponent,
	],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatPipesModule,
		TeamCoreComponentsModule,
		FilterItemModule,
		HappeningServiceModule,
		ReactiveFormsModule,
	],
})
export class ScheduleComponentModule {

}
