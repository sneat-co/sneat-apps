import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IRecord, RxRecordKey} from 'rxstore';
import {Slot} from 'sneat-shared/models/dto/dto-happening';

@Component({
	selector: 'app-regular-slots',
	templateUrl: './regular-slots.component.html',
})
export class RegularSlotsComponent {

	@Input() slots: Slot[];

	@Output() slotRemoved = new EventEmitter<Slot[]>();
	@Output() slotSelected = new EventEmitter<Slot>();

	removeSlot(slot: Slot): void {
		//tslint:disable-next-line:strict-comparisons
		this.slots = this.slots.filter(v => v !== slot);
		this.slotRemoved.emit(this.slots);
	}

	selectSlot(slot: Slot): void {
		this.slotSelected.emit(slot);
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, record: IRecord): RxRecordKey | undefined {
		return record.id;
	}
}
