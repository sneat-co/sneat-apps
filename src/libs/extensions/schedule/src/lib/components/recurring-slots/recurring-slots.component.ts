import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IHappeningSlot } from '@sneat/dto';

@Component({
	selector: 'sneat-recurring-slots',
	templateUrl: './recurring-slots.component.html',
})
export class RecurringSlotsComponent {

	@Input() slots?: IHappeningSlot[];

	@Output() slotRemoved = new EventEmitter<IHappeningSlot[]>();
	@Output() slotSelected = new EventEmitter<IHappeningSlot>();

	showSlotForm = false;

	readonly id = (i: number, record: { id: string }): string => record.id;

	removeSlot(slot: IHappeningSlot): void {
		//tslint:disable-next-line:strict-comparisons
		this.slots = this.slots?.filter(v => v !== slot);
		this.slotRemoved.emit(this.slots);
	}

	selectSlot(slot: IHappeningSlot): void {
		this.slotSelected.emit(slot);
	}

	onSlotAdded(): void {
		console.log('NewHappeningPage.onSlotRemoved() => slots.length:', this.slots?.length);
		this.showSlotForm = false;
	}

}
