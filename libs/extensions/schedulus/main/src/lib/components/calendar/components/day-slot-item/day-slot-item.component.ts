import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController, PopoverOptions } from '@ionic/angular';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ISlotUIContext } from '@sneat/extensions/schedulus/shared';
import { ISpaceContext } from '@sneat/team-models';
import { SlotContextMenuComponent } from '../slot-context-menu/slot-context-menu.component';
import { HappeningUIState } from '@sneat/mod-schedulus-core';

@Component({
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
})
export class DaySlotItemComponent {
	@Input() public slotContext?: ISlotUIContext;

	@Input() dateID?: string;

	@Input() mode: 'full' | 'brief' = 'full';
	@Input() color?: 'light';

	@Input() team: ISpaceContext = { id: '' };
	@Input() contactusTeam?: IContactusSpaceDboAndID;

	@Output() readonly slotClicked = new EventEmitter<{
		slot: ISlotUIContext;
		event: Event;
	}>();

	slotState?: HappeningUIState;

	protected get isCanceled(): boolean {
		return (
			!!this.slotContext?.adjustment?.canceled ||
			this.slotContext?.happening?.brief?.status === 'canceled'
		);
	}

	constructor(private readonly popoverController: PopoverController) {}

	protected onSlotClicked(event: Event): void {
		console.log('DaySlotItemComponent.onSlotClicked()');
		if (!this.slotContext) {
			return;
		}
		this.slotClicked.emit({ slot: this.slotContext, event });
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
		// const stateOutput = new EventEmitter<SlotContextState>();
		//
		// stateOutput.subscribe({
		// 	next: (slotState: SlotContextState) => {
		// 		this.slotState = slotState;
		// 	},
		// });
		event?.preventDefault();
		event?.stopPropagation();

		const popoverOptions: PopoverOptions = {
			component: SlotContextMenuComponent,
			componentProps: {
				team: this.team,
				slotContext: this.slotContext,
				dateID: this.dateID,
				// state: stateOutput,
			},
			event,
		};

		const popover = await this.popoverController.create(popoverOptions);
		await popover.present(event);
	}
}
