import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeekdayCode2 } from '@sneat/dto';
import { TeamDay, ISlotItem, NewHappeningParams } from '../../view-models';

export interface Weekday { // This is used to
	readonly id: WeekdayCode2;
	readonly longTitle: string;
	day?: TeamDay;
}

@Component({
	selector: 'sneat-schedule-week',
	templateUrl: './schedule-week.component.html',
})
export class ScheduleWeekComponent {

	@Input() filter = '';
	@Input() showRecurring = true;
	@Input() showEvents = true;
	@Input() weekdays?: Weekday[];

	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<ISlotItem>();

	readonly id = (i: number, item: Weekday): WeekdayCode2 => item.id;

	onDateSelected(date: Date): void {
		this.dateSelected.next(date);
	}
}
