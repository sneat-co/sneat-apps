import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { virtualSliderAnimations } from '@sneat/components';
import { ClassName } from '@sneat/ui';
import { CalendarDayComponent } from './calendar-day.component';
import { CalendarDayTitleComponent } from './calendar-day-title.component';
import { ISpaceContext } from '@sneat/space-models';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';
import { NewHappeningParams } from '@sneat/mod-schedulus-core';
import { getToday, CalendarStateService } from '../../calendar-state.service';
import { swipeableDay } from '../../../swipeable-ui';
import { CalendarAddButtonsComponent } from '../calendar-add-buttons/calendar-add-buttons.component';
import { CalendarDayBaseComponent } from './calendar-day-base.component';

// This is 1 of the 2 "day cards" used at ScheduleDayTabComponent
// The 1st is the "active day" (e.g. today), and the 2nd is "next day" (e.g. tomorrow).
// The 2nd should set the [activeDayPlus]="1"
@Component({
  animations: virtualSliderAnimations,
  imports: [
    CalendarDayComponent,
    CalendarAddButtonsComponent,
    CalendarDayTitleComponent,
    IonCard,
    IonItem,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
  ],
  providers: [{ provide: ClassName, useValue: 'ScheduleDayCardComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-calendar-day-card',
  templateUrl: 'calendar-day-card.component.html',
})
export class CalendarDayCardComponent
  extends CalendarDayBaseComponent
  implements OnInit
{
  public readonly $space = input.required<ISpaceContext>();

  public readonly $spaceDaysProvider = input.required<CalendarDataProvider>();

  @Output() readonly goNew = new EventEmitter<NewHappeningParams>();

  @Input() set activeDayPlus(value: number) {
    this.shiftDays = value;
    console.log('set activeDayPlus()', value, 'shiftDays=', this.shiftDays);
  }

  public constructor() {
    const scheduleSateService = inject(CalendarStateService);

    super(scheduleSateService);
  }

  public ngOnInit(): void {
    if (this.shiftDays < 0) {
      throw new Error('shiftDays < 0');
    }
    this.createSlides();
  }

  private createSlides(): void {
    const spaceDaysProvider = this.$spaceDaysProvider();
    const current = getToday();
    if (this.activeDayPlus) {
      current.setDate(current.getDate() + this.activeDayPlus);
    }
    this.$date.set(current);
    const next = new Date();
    next.setDate(current.getDate() + 1);
    this.oddSlide = swipeableDay(
      'odd',
      current,
      spaceDaysProvider,
      this.destroyed$,
    );
    this.evenSlide = swipeableDay(
      'even',
      next,
      spaceDaysProvider,
      this.destroyed$,
    );
    this.onDateChanged({ date: current, shiftDirection: '' });
  }
}
