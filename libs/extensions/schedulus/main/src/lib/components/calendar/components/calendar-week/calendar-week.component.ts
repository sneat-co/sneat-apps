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
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { TeamDaysProvider } from '../../../../services/team-days-provider';
import {
	ISlotUIContext,
	NewHappeningParams,
} from '@sneat/extensions/schedulus/shared';
import { ICalendarFilter } from '../calendar-filter/calendar-filter';
import { createWeekdays, Week } from '../../../schedule-core';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-week',
	templateUrl: './calendar-week.component.html',
})
export class CalendarWeekComponent implements OnChanges {
	@Input() team: ITeamContext = { id: '' };
	@Input() week?: Week;
	@Input() filter?: ICalendarFilter;
	@Input() teamDaysProvider?: TeamDaysProvider;

	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<{
		slot: ISlotUIContext;
		event: Event;
	}>();

	weekdays: Weekday[] = createWeekdays();

	readonly id = (i: number, item: Weekday): WeekdayCode2 => item.id;

	ngOnChanges(changes: SimpleChanges): void {
		this.onWeekInputChanged(changes['week']);
	}

	onDateSelected(date: Date): void {
		this.dateSelected.next(date);
	}

	onSlotClicked(args: { slot: ISlotUIContext; event: Event }): void {
		console.log('ScheduleWeekComponent.onSlotClicked()', args);
		this.slotClicked.emit(args);
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
		const { teamDaysProvider } = this;
		if (!teamDaysProvider) {
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
				day: teamDaysProvider.getTeamDay(date),
			};
		}
	}
}
