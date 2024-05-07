import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isToday, isTomorrow } from '../../../schedule-core';
import { SwipeableDay } from '../../../swipeable-ui';

@Component({
	selector: 'sneat-calendar-day-title',
	templateUrl: 'calendar-day-title.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayTitleComponent {
	@Input() day?: SwipeableDay;

	get date(): Date | undefined {
		return this.day?.weekday?.day?.date;
	}

	isToday(): boolean {
		return !this.date || isToday(this.date);
	}

	isTomorrow(): boolean {
		return !!this.date && isTomorrow(this.date);
	}
}
