import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	FilterItemComponent,
	MembersAsBadgesComponent,
	SneatPipesModule,
} from '@sneat/components';
import { MembersSelectorModule } from '@sneat/contactus-shared';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { ScheduleNavServiceModule } from '@sneat/extensions/schedulus/shared';
import {
	HappeningServiceModule,
	ScheduleDayServiceModule,
} from '@sneat/team/services';
import { ScheduleModalsServiceModule } from '../../services';
import { DaySlotItemComponent } from '../day-slot-item/day-slot-item.component';
import { RecurringCardComponent } from '../recurrings-tab/recurring-card.component';
import { RecurringsTabComponent } from '../recurrings-tab/recurrings-tab.component';
import { ScheduleCardHeaderComponent } from '../schedule-card-hearder/schedule-card-header.component';
import { ScheduleDayCardComponent } from '../schedule-day/schedule-day-card.component';
import { ScheduleDayTabComponent } from '../schedule-day/schedule-day-tab.component';
import { ScheduleDayTitleComponent } from '../schedule-day/schedule-day-title.component';
import { ScheduleDayComponent } from '../schedule-day/schedule-day.component';
import { ScheduleFilterService } from '../schedule-filter.service';
import { ScheduleFilterComponent } from '../schedule-filter';
import { ScheduleStateService } from '../schedule-state.service';
import { ScheduleWeekComponent } from '../schedule-week/schedule-week.component';
import { ScheduleWeekdayComponent } from '../schedule-weekday/schedule-weekday.component';
import { ScheduleComponent } from '../schedule/schedule.component';
import { HappeningCardComponent } from '../happening-card/happening-card.component';
import { SinglesTabComponent } from '../singles-tab/singles-tab.component';
import { ScheduleWeekCardComponent } from '../schedule-week/schedule-week-card.component';
import { ScheduleWeekTabComponent } from '../schedule-week/schedule-week-tab.component';
import { ScheduleWeekTitleComponent } from '../schedule-week/schedule-week-title.component';
import { SlotContextMenuComponent } from '../slot-context-menu/slot-context-menu.component';
import { TimingBadgeComponent } from '../timing-badge/timing-badge.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		SneatPipesModule,
		TeamCoreComponentsModule,
		FilterItemComponent,
		HappeningServiceModule,
		ScheduleDayServiceModule,
		ReactiveFormsModule,
		MembersAsBadgesComponent,
		ScheduleNavServiceModule,
		MembersSelectorModule,
		ScheduleModalsServiceModule,
	],
	exports: [ScheduleComponent],
	declarations: [
		ScheduleComponent,
		SlotContextMenuComponent,
		DaySlotItemComponent,
		TimingBadgeComponent,
		ScheduleDayComponent,
		ScheduleWeekComponent,
		ScheduleWeekdayComponent,
		RecurringsTabComponent,
		RecurringCardComponent,
		SinglesTabComponent,
		HappeningCardComponent,
		ScheduleDayCardComponent,
		ScheduleDayTabComponent,
		ScheduleDayTitleComponent,
		ScheduleWeekTabComponent,
		ScheduleWeekCardComponent,
		ScheduleWeekTitleComponent,
		ScheduleFilterComponent,
		ScheduleCardHeaderComponent,
	],
	providers: [ScheduleFilterService, ScheduleStateService],
})
export class ScheduleComponentModule {}
