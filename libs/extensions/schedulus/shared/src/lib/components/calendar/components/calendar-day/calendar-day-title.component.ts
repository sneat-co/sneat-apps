import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SneatPipesModule } from '@sneat/components';
import { WdToWeekdayPipe } from '@sneat/mod-schedulus-core';
import { isToday, isTomorrow } from '../../../schedule-core';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-day-title',
	templateUrl: 'calendar-day-title.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [WdToWeekdayPipe, SneatPipesModule],
})
export class CalendarDayTitleComponent {
	@Input({ required: true }) weekday?: Weekday;

	protected get date(): Date | undefined {
		return this.weekday?.day?.date;
	}

	protected isToday(): boolean {
		const date = this.date;
		return !date || isToday(date);
	}

	protected isTomorrow(): boolean {
		return isTomorrow(this.date);
	}
}
