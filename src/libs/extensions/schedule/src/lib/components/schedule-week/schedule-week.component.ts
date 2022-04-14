import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Weekday } from '@sneat/dto';
import {NewHappeningParams, SlotItem, Day} from '../../view-models';

@Component({
	selector: 'sneat-schedule-week',
	templateUrl: './schedule-week.component.html',
})
export class ScheduleWeekComponent {

	@Input() filter = '';
	@Input() showRecurring = true;
	@Input() showEvents = true;
	@Input() weekdays?: Day[];

	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<SlotItem>();

	readonly wd = (i: number, item: Day): Weekday => item.wd;

	onDateSelected(date: Date): void {
		this.dateSelected.next(date);
	}
}
