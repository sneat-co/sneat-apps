import { Component, Input } from '@angular/core';
import { IonicModule, PopoverController, PopoverOptions } from '@ionic/angular';
// import { MembersAsBadgesComponent } from '@sneat/components';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { MembersSelectorModule } from '@sneat/contactus-shared';
import {
	CalendarNavService,
	CalendarNavServicesModule,
	HappeningServiceModule,
} from '../../../../services';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/team-models';
import { HappeningSlotModalServiceModule } from '../../../happening-slot-form/happening-slot-modal.service';
import { HappeningSlotParticipantsComponent } from '../../../happening-slot-participants/happening-slot-participants.component';
import { TimingBadgeComponent } from '../timing-badge/timing-badge.component';

@Component({
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
	imports: [
		IonicModule,
		HappeningServiceModule,
		MembersSelectorModule,
		HappeningSlotModalServiceModule,
		HappeningSlotParticipantsComponent,
		TimingBadgeComponent,
		// MembersAsBadgesComponent,
		CalendarNavServicesModule,
	],
	// standalone: false, // circle dependencies DaySlotItemComponent->SlotContextMenuComponent->DaySlotItemComponent
})
export class DaySlotItemComponent {
	@Input() public slotContext?: ISlotUIContext;

	@Input() dateID?: string;

	@Input() mode: 'full' | 'brief' = 'full';
	@Input() color?: 'light';

	@Input({ required: true }) space?: ISpaceContext;
	@Input() contactusSpace?: IContactusSpaceDboAndID;

	protected get isCanceled(): boolean {
		return (
			!!this.slotContext?.adjustment?.canceled ||
			this.slotContext?.happening?.brief?.status === 'canceled'
		);
	}

	constructor(
		private readonly popoverController: PopoverController,
		private readonly calendarNavService: CalendarNavService,
	) {}

	protected onSlotClicked(event: Event): void {
		console.log('DaySlotItemComponent.onSlotClicked()');
		event.stopPropagation();
		if (!this.slotContext) {
			return;
		}
		this.calendarNavService.navigateToHappeningPage({
			slot: this.slotContext,
			event,
		});
	}

	protected showRsvp(event: Event): void {
		console.log('DaySlotItemComponent.showRsvp()');
		event.stopPropagation();
		event.preventDefault();
		alert("🚧 Sorry, the RSVP is not here yet.\n\n🚀 But it's coming soon! ");
	}

	protected async showContextMenu(
		event:
			| MouseEvent
			| TouchEvent
			| PointerEvent
			| CustomEvent<unknown>
			| undefined,
	): Promise<void> {
		event?.preventDefault();
		event?.stopPropagation();

		// TODO: Verify lazy loading works and try to make DaySlotItemComponent & SlotContextMenuComponent standalone
		import('./slot-context-menu.component').then(async (m) => {
			const popoverOptions: PopoverOptions = {
				component: m.SlotContextMenuComponent,
				componentProps: {
					space: this.space,
					slotContext: this.slotContext,
					dateID: this.dateID,
					// state: stateOutput,
				},
				event,
			};

			const popover = await this.popoverController.create(popoverOptions);
			await popover.present(event);
		});
	}
}
