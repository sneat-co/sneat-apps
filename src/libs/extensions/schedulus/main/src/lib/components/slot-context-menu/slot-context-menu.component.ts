import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { IHappeningContext, ITeamContext } from '@sneat/team/models';

const notImplemented = 'Sorry, not implemented yet';

@Component({
	selector: 'sneat-slot-context-menu',
	templateUrl: 'slot-context-menu.component.html',
})
export class SlotContextMenuComponent {
	@Input() team?: ITeamContext;
	@Input() public slot?: ISlotItem;

	constructor(
		private readonly popoverController: PopoverController,
	) {
	}

	assign(to: 'member' | 'contact'): void {
		console.log(`SlotContextMenuComponent.assign(${to})`);
		this.notImplemented();
	}

	edit(): void {
		console.log(`SlotContextMenuComponent.edit()`);
		this.notImplemented();
	}

	delete(): void {
		console.log(`SlotContextMenuComponent.delete()`);
		this.notImplemented();
	}

	archive(): void {
		console.log(`SlotContextMenuComponent.archive()`);
		this.notImplemented();
	}

	markCanceled(): void {
		console.log(`SlotContextMenuComponent.markCanceled()`);
		this.notImplemented();
	}

	notImplemented(): void {
		this.popoverController.dismiss().catch(console.error);
		setTimeout(() => alert(notImplemented), 100);
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
		});
		return n;
	}
}
