import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FilterItemModule, SneatPipesModule } from '@sneat/components';
import { ScheduleComponent } from '@sneat/extensions/schedule';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { RecurringItemComponent } from '../recurring-item/recurring-item.component';
import { ScheduleDayComponent } from '../schedule-day/schedule-day.component';
import { ScheduleWeekComponent } from '../schedule-week/schedule-week.component';
import { ScheduleWeekdayComponent } from '../schedule-weekday/schedule-weekday.component';


@NgModule({
	exports: [
		ScheduleComponent,
	],
	declarations: [
		ScheduleComponent,
		RecurringItemComponent,
		ScheduleDayComponent,
		ScheduleWeekComponent,
		ScheduleWeekdayComponent,
	],
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatPipesModule,
		TeamCoreComponentsModule,
		FilterItemModule,
	],
})
export class ScheduleComponentModule {

}
