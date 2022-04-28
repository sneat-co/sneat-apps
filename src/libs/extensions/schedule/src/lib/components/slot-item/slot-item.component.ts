import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISlotItem } from '../../view-models';

@Component({
	selector: 'sneat-slot-item',
	templateUrl: './slot-item.component.html',
})
export class SlotItemComponent {

	@Input()
	public slot?: ISlotItem;

	@Output() onclick = new EventEmitter<ISlotItem>();

	onSlotClicked(event: Event): void {
		this.onclick.emit(this.slot);
	}
}
