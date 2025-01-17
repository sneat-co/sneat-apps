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
import { SpaceCoreComponentsModule } from '@sneat/team-components';
import { ScheduleNavServiceModule } from '@sneat/mod-schedulus-core';
import { HappeningServiceModule, CalendarDayServiceModule } from '../..';
import { ContactsFilterComponent } from '../contacts-filter/contacts-filter.component';
import { HappeningSlotModalServiceModule } from '../happening-slot-form/happening-slot-modal.service';
import { HappeningSlotParticipantsComponent } from '../happening-slot-participants/happening-slot-participants.component';
import { HappeningSlotComponent } from '../happening-slot/happening-slot.component';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';
import { CalendarAddButtonsComponent } from './components/calendar-add-buttons/calendar-add-buttons.component';
import { DaySlotItemComponent } from './components/day-slot-item/day-slot-item.component';
import { SingleHappeningsListComponent } from './components/singles-tab/single-happenings-list.component';
import { RecurringCardComponent } from './components/recurrings-tab/recurring-card.component';
import { RecurringsTabComponent } from './components/recurrings-tab/recurrings-tab.component';
import { CalendarCardHeaderComponent } from './components/calendar-card-header/calendar-card-header.component';
import { CalendarDayCardComponent } from './components/calendar-day/calendar-day-card.component';
import { CalendarDayTabComponent } from './components/calendar-day/calendar-day-tab.component';
import { CalendarDayTitleComponent } from './components/calendar-day/calendar-day-title.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { CalendarFilterService } from '../calendar-filter.service';
import { CalendarFilterComponent } from './components/calendar-filter/calendar-filter.component';
import { CalendarStateService } from './calendar-state.service';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week.component';
import { CalendarWeekTabComponent } from './components/calendar-week/calendar-week-tab.component';
import { CalendarWeekCardComponent } from './components/calendar-week/calendar-week-card.component';
import { CalendarWeekTitleComponent } from './components/calendar-week/calendar-week-title.component';
import { CalendarWeekdayComponent } from './components/calendar-weekday/calendar-weekday.component';
import { CalendarComponent } from './calendar.component';
import { HappeningCardComponent } from '../happening-card/happening-card.component';
import { SinglesTabComponent } from './components/singles-tab/singles-tab.component';
import { SlotContextMenuComponent } from './components/slot-context-menu/slot-context-menu.component';
import { TimingBadgeComponent } from './components/timing-badge/timing-badge.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		SneatPipesModule,
		SpaceCoreComponentsModule,
		FilterItemComponent,
		HappeningServiceModule,
		CalendarDayServiceModule,
		ReactiveFormsModule,
		MembersAsBadgesComponent,
		ScheduleNavServiceModule,
		MembersSelectorModule,
		HappeningSlotModalServiceModule,
		HappeningSlotComponent,
		ContactsFilterComponent,
		HappeningSlotParticipantsComponent,
		HappeningSlotsComponent,
		CalendarAddButtonsComponent,
	],
	exports: [CalendarComponent, CalendarDayComponent],
	declarations: [
		CalendarComponent,
		SlotContextMenuComponent,
		DaySlotItemComponent,
		TimingBadgeComponent,
		CalendarDayComponent,
		CalendarWeekComponent,
		CalendarWeekdayComponent,
		RecurringsTabComponent,
		RecurringCardComponent,
		SinglesTabComponent,
		HappeningCardComponent,
		CalendarDayCardComponent,
		CalendarDayTabComponent,
		CalendarDayTitleComponent,
		CalendarWeekTabComponent,
		CalendarWeekCardComponent,
		CalendarWeekTitleComponent,
		CalendarFilterComponent,
		CalendarCardHeaderComponent,
		SingleHappeningsListComponent,
	],
	providers: [CalendarFilterService, CalendarStateService],
})
export class CalendarComponentModule {}
