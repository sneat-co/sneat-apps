import {
  IDateChanged,
  CalendarStateService,
} from '../../calendar-state.service';
import { SwipeableBaseComponent } from '../../../swipeable-base.component';
import { SwipeableDay } from '../../../swipeable-ui';

export abstract class CalendarDayBaseComponent extends SwipeableBaseComponent {
  get oddDay(): SwipeableDay | undefined {
    return (this.oddSlide as SwipeableDay) || undefined;
  }

  get evenDay(): SwipeableDay | undefined {
    return (this.evenSlide as SwipeableDay) || undefined;
  }

  get activeDay(): SwipeableDay | undefined {
    return (this.activeSlide as SwipeableDay) || undefined;
  }

  protected constructor(scheduleSateService: CalendarStateService) {
    super(scheduleSateService, 1);
  }

  override onDateChanged(changed: IDateChanged): void {
    if (this.shiftDays) {
      const d = changed.date;
      changed = {
        ...changed,
        date: new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate() + this.shiftDays,
        ),
      };
    }
    super.onDateChanged(changed);
  }
}
