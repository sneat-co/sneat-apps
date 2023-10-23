import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isToday, isTomorrow } from '../../../schedule-core';
import { SwipeableDay } from '../../../swipeable-ui';

@Component({
	selector: 'sneat-schedule-day-title',
	templateUrl: 'schedule-day-title.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDayTitleComponent {
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
