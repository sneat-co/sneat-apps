import { Component, Input, input, computed } from '@angular/core';
import {
	PopoverController,
	PopoverOptions,
	IonBadge,
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonLabel,
	IonText,
} from '@ionic/angular/standalone';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { ContactsSelectorModule } from '@sneat/contactus-shared';
import {
	CalendarNavService,
	CalendarNavServicesModule,
	HappeningServiceModule,
} from '../../../../services';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import { HappeningSlotModalServiceModule } from '../../../happening-slot-form/happening-slot-modal.service';
import { HappeningSlotParticipantsComponent } from '../../../happening-slot-participants/happening-slot-participants.component';
import { TimingBadgeComponent } from '../timing-badge/timing-badge.component';

@Component({
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
	providers: [ContactusSpaceService],
	imports: [
		HappeningServiceModule,
		ContactsSelectorModule,
		HappeningSlotModalServiceModule,
		HappeningSlotParticipantsComponent,
		TimingBadgeComponent,
		// MembersAsBadgesComponent,
		CalendarNavServicesModule,
		IonItem,
		IonIcon,
		IonLabel,
		IonText,
		IonBadge,
		IonButtons,
		IonButton,
	],
	// standalone: false, // circle dependencies DaySlotItemComponent->SlotContextMenuComponent->DaySlotItemComponent
})
export class DaySlotItemComponent {
	public readonly $slotContext = input.required<ISlotUIContext>();

	@Input() dateID?: string;

	@Input() mode: 'full' | 'brief' = 'full';
	@Input() color?: 'light';

	@Input({ required: true }) space?: ISpaceContext;
	@Input() contactusSpace?: IContactusSpaceDboAndID;

	protected readonly $isCanceled = computed(() => {
		const { happening, adjustment } = this.$slotContext();
		return happening?.brief?.status === 'canceled' || !!adjustment?.canceled;
	});

	constructor(
		private readonly popoverController: PopoverController,
		private readonly calendarNavService: CalendarNavService,
	) {}

	protected onSlotClicked(event: Event): void {
		console.log('DaySlotItemComponent.onSlotClicked()');
		event.stopPropagation();
		const slot = this.$slotContext();
		if (!slot) {
			return;
		}
		this.calendarNavService.navigateToHappeningPage({
			slot: slot,
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
			const slotContext = this.$slotContext();
			console.log(
				'DaySlotItemComponent.showContextMenu() slotContext:',
				slotContext,
			);
			const popoverOptions: PopoverOptions = {
				component: m.SlotContextMenuComponent,
				componentProps: {
					space: this.space,
					slotContext,
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
