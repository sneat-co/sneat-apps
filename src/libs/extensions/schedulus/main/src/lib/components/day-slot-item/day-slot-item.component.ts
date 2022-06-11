import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PopoverController, PopoverOptions } from '@ionic/angular';
import { ITeamContext } from '@sneat/team/models';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { SlotContextMenuComponent } from '../slot-context-menu/slot-context-menu.component';

@Component({
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
})
export class DaySlotItemComponent {

	@Input() public slot?: ISlotItem;

	@Input() mode: 'full' | 'brief' = 'full';
	@Input() color?: 'light';

	@Input() team?: ITeamContext;

	@Output() onclick = new EventEmitter<ISlotItem>();

	constructor(
		private readonly popoverController: PopoverController,
	) {
	}

	onSlotClicked(event: Event): void {
		this.onclick.emit(this.slot);
	}

	async showContextMenu(event: MouseEvent | TouchEvent | PointerEvent | CustomEvent<any> | undefined): Promise<void> {
		const popoverOptions: PopoverOptions = {
			component: SlotContextMenuComponent,
			componentProps: {
				team: this.team,
				slot: this.slot,
			},
			event,
		};
		const popover = await this.popoverController.create(popoverOptions);
		await popover.present(event);
	}
}
