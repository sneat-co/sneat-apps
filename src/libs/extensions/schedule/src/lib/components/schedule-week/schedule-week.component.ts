import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { WeekdayCode2 } from '@sneat/dto';
import { ISlotItem, NewHappeningParams, TeamDay } from '../../view-models';
import { createWeekdays } from '../schedule/schedule-core';

export interface Weekday { // This is used to
	readonly id: WeekdayCode2;
	readonly longTitle: string;
	day?: TeamDay;
}

@Component({
	selector: 'sneat-schedule-week',
	templateUrl: './schedule-week.component.html',
})
export class ScheduleWeekComponent implements OnChanges {

	@Input() filter = '';
	@Input() showRecurring = true;
	@Input() showEvents = true;

	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<ISlotItem>();

	weekdays: Weekday[] = createWeekdays();

	readonly id = (i: number, item: Weekday): WeekdayCode2 => item.id;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['day']) {
			//
		}
	}

	onDateSelected(date: Date): void {
		this.dateSelected.next(date);
	}
}
