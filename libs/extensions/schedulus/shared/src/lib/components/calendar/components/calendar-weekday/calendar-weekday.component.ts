import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ShortMonthNamePipe } from '@sneat/components';
import { HappeningType } from '@sneat/mod-schedulus-core';
import {
  ISlotUIContext,
  NewHappeningParams,
  ScheduleNavService,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import { ClassName, SneatBaseComponent } from '@sneat/ui';
import { CalendarDay } from '../../../../services/calendar-day';
import {
  emptyCalendarFilter,
  CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../calendar-slots';
import { Weekday } from '../../weekday';
import { ICalendarFilter } from '../calendar-filter/calendar-filter';
import { DaySlotItemComponent } from '../day-slot-item/day-slot-item.component';

@Component({
  imports: [
    DaySlotItemComponent,
    ShortMonthNamePipe,
    IonItemDivider,
    IonLabel,
    IonSpinner,
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
  ],
  providers: [{ provide: ClassName, useValue: 'CalendarWeekdayComponent' }],
  selector: 'sneat-calendar-weekday',
  templateUrl: './calendar-weekday.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekdayComponent extends SneatBaseComponent {
  public readonly $space = input.required<ISpaceContext | undefined>();

  public readonly $weekday = input.required<Weekday>();
  protected readonly $day = computed(() => this.$weekday().day);

  @Output() readonly dateSelected = new EventEmitter<Date>();

  protected readonly $filter = signal(emptyCalendarFilter);

  private readonly scheduleNavService = inject(ScheduleNavService);

  constructor() {
    super();
    const filterService = inject(CalendarFilterService);
    filterService.filter
      .pipe(this.takeUntilDestroyed())
      .subscribe(this.$filter.set);
  }

  // we pass day and filter to let the template know about the dependencies.
  protected showSlot(
    slot: ISlotUIContext,
    day: CalendarDay | undefined,
    filter: ICalendarFilter,
  ): boolean {
    return !!day && isSlotVisible(slot, filter);
  }

  protected onDateSelected(): void {
    // console.log('onDateSelected', event);
    const day = this.$weekday().day;
    if (day?.date) {
      this.dateSelected.next(day.date);
    }
  }

  protected goNewHappening(type: HappeningType): void {
    const space = this.$space();
// console.log(
      `ScheduleWeekdayComponent.goNewHappening() type=${type}, space=${JSON.stringify(space)}`,
    );
    if (!space) {
      return;
    }
    const params: NewHappeningParams = {
      type,
      wd: this.$weekday().id,
      date: this.$weekday().day?.dateID,
    };
    this.scheduleNavService.goNewHappening(space, params);
  }
}
