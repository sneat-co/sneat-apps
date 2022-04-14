import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewHappeningParams, SlotItem, Day } from '../../view-models';
import { isSlotVisible } from '../schedile-slots';

@Component({
	selector: 'sneat-schedule-weekday',
	templateUrl: './schedule-weekday.component.html',
})
export class ScheduleWeekdayComponent {

	@Input() weekday?: Day;
	@Input() filter = '';
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<SlotItem>();

	showSlot(slot: SlotItem): boolean {
		return isSlotVisible(slot, this.filter, this.showRegulars, this.showEvents);
	}

	onDateSelected(): void {
		// console.log('onDateSelected', event);
		if (this.weekday?.date) {
			this.dateSelected.next(this.weekday?.date);
		}
	}
}
