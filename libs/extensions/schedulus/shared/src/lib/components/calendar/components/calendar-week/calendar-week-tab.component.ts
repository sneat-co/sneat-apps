import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WithSpaceInput } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';
import { CalendarWeekCardComponent } from './calendar-week-card.component';

@Component({
  selector: 'sneat-week-tab',
  templateUrl: 'calendar-week-tab.component.html',
  imports: [CalendarWeekCardComponent],
  providers: [{ provide: ClassName, useValue: 'CalendarWeekTabComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekTabComponent extends WithSpaceInput {
  public readonly $spaceDaysProvider = input.required<CalendarDataProvider>();

  public constructor() {
    super();
  }
}
