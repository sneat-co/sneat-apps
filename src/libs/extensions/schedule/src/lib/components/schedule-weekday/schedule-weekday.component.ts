import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISlotItem, NewHappeningParams, TeamDay } from '../../view-models';
import { isSlotVisible } from '../schedile-slots';

@Component({
	selector: 'sneat-schedule-weekday',
	templateUrl: './schedule-weekday.component.html',
})
export class ScheduleWeekdayComponent {

	@Input() day?: TeamDay;
	@Input() filter = '';
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<ISlotItem>();

	showSlot(slot: ISlotItem): boolean {
		return isSlotVisible(slot, this.filter, this.showRegulars, this.showEvents);
	}

	onDateSelected(): void {
		// console.log('onDateSelected', event);
		if (this.day?.date) {
			this.dateSelected.next(this.day?.date);
		}
	}
}
