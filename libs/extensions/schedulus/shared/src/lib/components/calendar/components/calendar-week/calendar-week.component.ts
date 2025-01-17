import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import { dateToIso } from '@sneat/core';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import { NewHappeningParams } from '@sneat/mod-schedulus-core';
import { ICalendarFilter } from '../calendar-filter/calendar-filter';
import { createWeekdays, Week } from '../../../schedule-core';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-week',
	templateUrl: './calendar-week.component.html',
	standalone: false,
})
export class CalendarWeekComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) week?: Week;
	@Input({ required: true }) spaceDaysProvider?: SpaceDaysProvider;
	@Input() filter?: ICalendarFilter;

	@Output() readonly goNew = new EventEmitter<NewHappeningParams>();
	@Output() readonly dateSelected = new EventEmitter<Date>();

	protected weekdays: Weekday[] = createWeekdays();

	ngOnChanges(changes: SimpleChanges): void {
		this.onWeekInputChanged(changes['week']);
	}

	private onWeekInputChanged(week: SimpleChange): void {
		// console.log('ScheduleWeekComponent.onWeekInputChanged()', week);
		if (!week) {
			return;
		}
		const prevWeek = week.previousValue as Week | undefined;
		const currentWeek = week.currentValue as Week | undefined;
		if (
			!currentWeek ||
			prevWeek === currentWeek ||
			(prevWeek &&
				currentWeek &&
				dateToIso(prevWeek.startDate) == dateToIso(currentWeek.startDate))
		) {
			return;
		}
		const { spaceDaysProvider } = this;
		if (!spaceDaysProvider) {
			return;
		}
		const startDate = currentWeek.startDate.getDate();
		// console.log('ScheduleWeekComponent.onWeekInputChanged() => startDate', startDate, currentWeek.startDate);
		for (let i = 0; i < 7; i++) {
			let date = new Date(currentWeek.startDate);
			date = new Date(date.setDate(startDate + i));
			// console.log('ScheduleWeekComponent.onWeekInputChanged() => i=', i, '; startDate:', currentWeek.startDate, '; date:', date);
			this.weekdays[i] = {
				...this.weekdays[i],
				day: spaceDaysProvider.getSpaceDay(date),
			};
		}
	}
}
