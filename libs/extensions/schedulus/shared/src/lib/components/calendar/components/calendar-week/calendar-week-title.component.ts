import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ShortMonthNamePipe } from '@sneat/components';
import { SwipeableWeek } from '../../../swipeable-ui';

@Component({
  selector: 'sneat-calendar-week-title',
  templateUrl: 'calendar-week-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ShortMonthNamePipe],
})
export class CalendarWeekTitleComponent {
  @Input({ required: true }) week?: SwipeableWeek;
}
