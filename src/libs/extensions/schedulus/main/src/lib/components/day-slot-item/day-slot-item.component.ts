import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-day-slot-item',
	templateUrl: './day-slot-item.component.html',
})
export class DaySlotItemComponent {

	@Input()
	public slot?: ISlotItem;

	@Input() team?: ITeamContext;

	@Output() onclick = new EventEmitter<ISlotItem>();

	onSlotClicked(event: Event): void {
		this.onclick.emit(this.slot);
	}
}
