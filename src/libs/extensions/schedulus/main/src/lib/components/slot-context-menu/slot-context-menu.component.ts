import { Component, Input } from '@angular/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { IHappeningContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-slot-context-menu',
	templateUrl: 'slot-context-menu.component.html',
})
export class SlotContextMenuComponent {
	@Input() team?: ITeamContext;
	@Input() public slot?: ISlotItem;

	assign(to: 'member' | 'contact'): void {
		console.log(`SlotContextMenuComponent.assign(${to})`);
	}
	edit(): void {
		console.log(`SlotContextMenuComponent.edit()`);
	}
	delete(): void {
		console.log(`SlotContextMenuComponent.delete()`);
	}
	archive(): void {
		console.log(`SlotContextMenuComponent.archive()`);
	}
	markCanceled(): void {
		console.log(`SlotContextMenuComponent.markCanceled()`);
	}

	numberOfSlots(happening?: IHappeningContext): number {
		let n = 0;
		if (!happening) {
			return n;
		}
		const brief = happening?.brief;
		if (!brief) {
			return n;
		}
		const slots = brief.slots;
		if (!slots) {
			return n;
		}
		slots.forEach(slot => {
			slot.weekdays?.forEach(() => n++);
		})
		return n;
	}
}
