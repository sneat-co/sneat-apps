import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SwipeableWeek } from '../../../swipeable-ui';

@Component({
	selector: 'sneat-calendar-week-title',
	templateUrl: 'calendar-week-title.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class CalendarWeekTitleComponent {
	@Input() week?: SwipeableWeek;
}
