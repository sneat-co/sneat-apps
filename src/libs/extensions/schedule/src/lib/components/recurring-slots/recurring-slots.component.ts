import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Slot } from '@sneat/dto';

@Component({
	selector: 'sneat-recurring-slots',
	templateUrl: './recurring-slots.component.html',
})
export class RecurringSlotsComponent {

	@Input() slots?: Slot[];

	@Output() slotRemoved = new EventEmitter<Slot[]>();
	@Output() slotSelected = new EventEmitter<Slot>();

	readonly id = (i: number, record: { id: string}): string => record.id;

	removeSlot(slot: Slot): void {
		//tslint:disable-next-line:strict-comparisons
		this.slots = this.slots?.filter(v => v !== slot);
		this.slotRemoved.emit(this.slots);
	}

	selectSlot(slot: Slot): void {
		this.slotSelected.emit(slot);
	}
}
