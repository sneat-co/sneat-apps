import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { IonAccordionGroup } from '@ionic/angular/standalone';
import {
  ICalendarHappeningBrief,
  RepeatPeriod,
  ShowBy,
} from '@sneat/extension-calendarius-contract';
import { WithSpaceInput } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { getLiabilitiesByPeriod } from './budget-calc-periods';
import { LiabilitiesByPeriod, LiabilitiesMode } from './budget-component-types';
import { BudgetPeriodComponent } from './budget-period.component';

@Component({
  selector: 'sneat-budget-periods',
  templateUrl: './budget-periods.component.html',
  imports: [BudgetPeriodComponent, IonAccordionGroup],
  providers: [{ provide: ClassName, useValue: 'BudgetPeriodsComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetPeriodsComponent extends WithSpaceInput {
  public readonly $recurringHappenings = input.required<
    undefined | Readonly<Record<string, ICalendarHappeningBrief>>
  >();

  public readonly $liabilitiesMode = input.required<LiabilitiesMode>();

  public readonly activePeriod = input<RepeatPeriod>('weekly');

  protected readonly periods: RepeatPeriod[] = [
    // 'daily',
    'weekly',
    'monthly',
    'yearly',
  ];

  protected readonly $showBy = signal<ShowBy>('event');

  readonly activePeriodChange = output<RepeatPeriod>();

  protected onPeriodChanged(event: Event): void {
    this.activePeriodChange.emit((event as CustomEvent).detail.value);
  }

  protected readonly $liabilitiesByPeriod = computed<LiabilitiesByPeriod>(
    () => {
      const recurringHappenings = this.$recurringHappenings();
      if (!recurringHappenings) {
        return {};
      }
      const lbp = getLiabilitiesByPeriod(
        this.$liabilitiesMode(),
        recurringHappenings,
        this.$space(),
      );
      // console.log('BudgetPeriodsComponent: lbp', lbp);
      return lbp;
    },
  );
}
