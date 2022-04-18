import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { dateToIso } from '@sneat/core';
import { WeekdayCode2 } from '@sneat/dto';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem, NewHappeningParams, TeamDay } from '../../view-models';
import { createWeekdays, Week } from '../schedule/schedule-core';

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

	@Input() week?: Week;
	@Input() filter = '';
	@Input() showRecurring = true;
	@Input() showEvents = true;
	@Input() teamDaysProvider?: TeamDaysProvider;

	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<ISlotItem>();


	weekdays: Weekday[] = createWeekdays();

	readonly id = (i: number, item: Weekday): WeekdayCode2 => item.id;

	ngOnChanges(changes: SimpleChanges): void {
		this.onWeekInputChanged(changes['week']);
	}

	onDateSelected(date: Date): void {
		this.dateSelected.next(date);
	}

	private onWeekInputChanged(week: SimpleChange): void {
		console.log('onWeekInputChanged()', week);
		const prevWeek = week.previousValue as Week | undefined;
		const currentWeek = week.currentValue as Week | undefined;
		if (!currentWeek || prevWeek === currentWeek || prevWeek && currentWeek && dateToIso(prevWeek.startDate) == dateToIso(currentWeek.startDate)) {
			return;
		}
		const { teamDaysProvider } = this;
		if (!teamDaysProvider) {
			return;
		}
		const startDate = currentWeek.startDate.getDate();
		for (let i = 0; i < 7; i++) {
			const date = new Date();
			date.setDate(startDate + i);
			this.weekdays[i].day = teamDaysProvider.getTeamDay(date);
		}
	}
}
