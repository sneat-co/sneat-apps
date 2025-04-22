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
import { IonItemGroup } from '@ionic/angular/standalone';
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
	imports: [CalendarWeekdayComponent, IonItemGroup],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekComponent implements OnChanges {
	public readonly $space = input.required<ISpaceContext | undefined>();
	public readonly $week = input.required<Week>();

	@Input({ required: true }) spaceDaysProvider?: CalendarDataProvider;
	@Input() filter?: ICalendarFilter;

	@Output() readonly goNew = new EventEmitter<NewHappeningParams>();
	@Output() readonly dateSelected = new EventEmitter<Date>();

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
		if (changes['spaceDaysProvider']) {
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
		const spaceDaysProvider = this.spaceDaysProvider;
		if (!spaceDaysProvider) {
			console.log('WARN: recreateWeekdays(): spaceDaysProvider is not set');
			return;
		}
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
