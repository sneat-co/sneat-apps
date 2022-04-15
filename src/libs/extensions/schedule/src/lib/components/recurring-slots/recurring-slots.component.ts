import {Component, EventEmitter, Input, Output} from '@angular/core';
import { IRecurringSlot } from '@sneat/dto';

@Component({
	selector: 'sneat-recurring-slots',
	templateUrl: './recurring-slots.component.html',
})
export class RecurringSlotsComponent {

	@Input() slots?: IRecurringSlot[];

	@Output() slotRemoved = new EventEmitter<IRecurringSlot[]>();
	@Output() slotSelected = new EventEmitter<IRecurringSlot>();

	readonly id = (i: number, record: { id: string}): string => record.id;

	removeSlot(slot: IRecurringSlot): void {
		//tslint:disable-next-line:strict-comparisons
		this.slots = this.slots?.filter(v => v !== slot);
		this.slotRemoved.emit(this.slots);
	}

	selectSlot(slot: IRecurringSlot): void {
		this.slotSelected.emit(slot);
	}
}
