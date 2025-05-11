import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	input,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import { dateToIso } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';
import { NewHappeningParams } from '@sneat/mod-schedulus-core';
import { Week } from '../../../week';
import { ICalendarFilter } from '../calendar-filter/calendar-filter';
import { createWeekdays } from '../../../calendar-core';
import { CalendarWeekdayComponent } from '../calendar-weekday/calendar-weekday.component';

@Component({
	selector: 'sneat-calendar-week',
	templateUrl: './calendar-week.component.html',
	imports: [CalendarWeekdayComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekComponent implements OnChanges {
	public readonly $space = input.required<ISpaceContext | undefined>();
	public readonly $week = input.required<Week>();

	public readonly $spaceDaysProvider = input.required<CalendarDataProvider>();
	// @Input() filter?: ICalendarFilter;

	@Output() readonly goNew = new EventEmitter<NewHappeningParams>();
	@Output() readonly dateSelected = new EventEmitter<Date>();

	/* Having trouble to make it computed due to:
	ERROR RuntimeError: NG0602: effect() cannot be called from within a reactive context. Call `effect` outside of a reactive context. For example, schedule the effect inside the component constructor. Find more at https://angular.dev/errors/NG0602
    at assertNotInReactiveContext (core.mjs:8451:15)
    at effect (core.mjs:39579:9)
    at calendar-day.ts:101:27
    at runInInjectionContext (core.mjs:2467:16)
    at new CalendarDay (calendar-day.ts:100:24)
    at CalendarDataProvider.getCalendarDay (calendar-data-provider.ts:182:10)
    at calendar-week.component.ts:54:28
    at Array.map (<anonymous>)
    at Object.computation (calendar-week.component.ts:50:19)
	 */
	protected readonly $weekdays = signal(createWeekdays());

	ngOnChanges(changes: SimpleChanges): void {
		console.log(
			'CalendarWeekComponent.ngOnChanges()',
			this.$week().startDate,
			changes,
		);
		if (changes['$week']) {
			this.onWeekInputChanged(changes['$week']);
		}
		if (changes['$spaceDaysProvider']) {
			this.onSpaceChanged();
		}
	}

	private onSpaceChanged(): void {
		const week = this.$week();
		if (week.startDate) {
			this.recreateWeekdays(week.startDate);
		}
	}

	private recreateWeekdays(startDate: Date): void {
		console.log('ScheduleWeekComponent.recreateWeekdays()', startDate);
		const spaceDaysProvider = this.$spaceDaysProvider();
		const startDateN = startDate.getDate();
		this.$weekdays.update((weekdays) =>
			weekdays.map((wd, i) => {
				const date = new Date(new Date().setDate(startDateN + i));
				return {
					...wd,
					day: spaceDaysProvider.getCalendarDay(date),
				};
			}),
		);
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
