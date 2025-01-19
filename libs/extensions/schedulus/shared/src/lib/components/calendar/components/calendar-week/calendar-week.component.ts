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
import { Week } from '../../../week';
import { ICalendarFilter } from '../calendar-filter/calendar-filter';
import { createWeekdays } from '../../../schedule-core';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-week',
	templateUrl: './calendar-week.component.html',
	standalone: false,
})
export class CalendarWeekComponent implements OnChanges {
	@Input({ required: true }) week?: Week;
	@Input({ required: true }) spaceDaysProvider?: SpaceDaysProvider;
	@Input() filter?: ICalendarFilter;

	@Output() readonly goNew = new EventEmitter<NewHappeningParams>();
	@Output() readonly dateSelected = new EventEmitter<Date>();

	protected weekdays: readonly Weekday[] = createWeekdays();

	ngOnChanges(changes: SimpleChanges): void {
		console.log(
			'CalendarWeekComponent.ngOnChanges()',
			this.week?.startDate,
			changes,
		);
		if (changes['week']) {
			this.onWeekInputChanged(changes['week']);
		}
		if (changes['spaceDaysProvider']) {
			this.onSpaceChanged();
		}
	}

	private onSpaceChanged(): void {
		if (this.week?.startDate) {
			this.recreateWeekdays(this.week.startDate);
		}
	}

	private recreateWeekdays(startDate: Date): void {
		console.log('ScheduleWeekComponent.recreateWeekdays()', startDate);
		const spaceDaysProvider = this.spaceDaysProvider;
		if (!spaceDaysProvider) {
			console.log('WARN: recreateWeekdays(): spaceDaysProvider is not set');
			return;
		}
		const startDateN = startDate.getDate();
		this.weekdays = this.weekdays.map((wd, i) => {
			let date = new Date();
			date = new Date(date.setDate(startDateN + i));
			return {
				...this.weekdays[i],
				day: spaceDaysProvider.getSpaceDay(date),
			};
		});
	}

	private onWeekInputChanged(weekChange: SimpleChange): void {
		// console.log('ScheduleWeekComponent.onWeekInputChanged()', week);
		const prevWeek = weekChange.previousValue as Week | undefined;
		const currentWeek = weekChange.currentValue as Week | undefined;
		if (
			!currentWeek ||
			prevWeek === currentWeek ||
			(prevWeek &&
				currentWeek &&
				dateToIso(prevWeek.startDate) == dateToIso(currentWeek.startDate))
		) {
			return;
		}
		this.recreateWeekdays(currentWeek.startDate);
		// console.log('ScheduleWeekComponent.onWeekInputChanged() => startDate', startDate, currentWeek.startDate);
	}
}
