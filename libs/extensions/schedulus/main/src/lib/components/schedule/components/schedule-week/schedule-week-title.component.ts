import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SwipeableWeek } from '../../../swipeable-ui';

@Component({
	selector: 'sneat-schedule-week-title',
	templateUrl: 'schedule-week-title.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleWeekTitleComponent {
	@Input() week?: SwipeableWeek;
}
