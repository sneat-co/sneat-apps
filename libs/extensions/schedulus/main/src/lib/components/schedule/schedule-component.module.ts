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
import { TeamCoreComponentsModule } from '@sneat/team-components';
import { ScheduleNavServiceModule } from '@sneat/extensions/schedulus/shared';
import {
	HappeningServiceModule,
	ScheduleDayServiceModule,
} from '@sneat/team-services';
import { ScheduleModalsServiceModule } from '../../services';
import { DaySlotItemComponent } from './components';
import { RecurringCardComponent } from './components';
import { RecurringsTabComponent } from './components';
import { ScheduleCardHeaderComponent } from './components';
import { ScheduleDayCardComponent } from './components';
import { ScheduleDayTabComponent } from './components';
import { ScheduleDayTitleComponent } from './components';
import { ScheduleDayComponent } from './components';
import { ScheduleFilterService } from '../schedule-filter.service';
import { ScheduleFilterComponent } from './components';
import { ScheduleStateService } from './schedule-state.service';
import { ScheduleWeekComponent } from './components';
import { ScheduleWeekdayComponent } from './components';
import { ScheduleComponent } from '../schedule/schedule.component';
import { HappeningCardComponent } from '../happening-card/happening-card.component';
import { SinglesTabComponent } from './components';
import { ScheduleWeekCardComponent } from './components';
import { ScheduleWeekTabComponent } from './components';
import { ScheduleWeekTitleComponent } from './components';
import { SlotContextMenuComponent } from './components';
import { TimingBadgeComponent } from './components';

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
