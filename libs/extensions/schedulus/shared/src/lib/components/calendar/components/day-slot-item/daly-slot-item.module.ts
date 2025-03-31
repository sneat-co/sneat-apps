import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactsAsBadgesComponent } from '@sneat/components';
import { MembersSelectorModule } from '@sneat/contactus-shared';
import {
	CalendarNavServicesModule,
	HappeningServiceModule,
} from '../../../../services';
import { HappeningSlotModalServiceModule } from '../../../happening-slot-form/happening-slot-modal.service';
import { HappeningSlotParticipantsComponent } from '../../../happening-slot-participants/happening-slot-participants.component';
import { TimingBadgeComponent } from '../timing-badge/timing-badge.component';
// import { DaySlotItemComponent } from './day-slot-item.component';
// import { SlotContextMenuComponent } from './slot-context-menu.component';

@NgModule({
	// We need to create a module for the component due to circle dependencies:
	//
	// declarations: [SlotContextMenuComponent],
	// exports: [DaySlotItemComponent],
	imports: [
		IonicModule,
		HappeningServiceModule,
		MembersSelectorModule,
		HappeningSlotModalServiceModule,
		HappeningSlotParticipantsComponent,
		TimingBadgeComponent,
		ContactsAsBadgesComponent,
		CalendarNavServicesModule,
	],
})
export class DaySlotItemModule {} // TODO: remove unused once SlotContextMenuComponent tested
