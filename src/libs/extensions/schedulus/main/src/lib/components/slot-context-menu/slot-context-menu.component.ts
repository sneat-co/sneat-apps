import { Component, Input } from '@angular/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ITeamContext } from '@sneat/team/models';

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
}
