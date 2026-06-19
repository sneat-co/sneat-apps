import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonAccordion,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from '@ionic/angular/standalone';
import { Decimal64p2Pipe } from '@sneat/components';
import {
  IAmount,
  RepeatPeriod,
  ShowBy,
} from '@sneat/extension-calendarius-core';
import {
  ILiabilityBase,
  IPeriodLiabilities,
  LiabilitiesByPeriod,
  LiabilitiesMode,
} from './budget-component-types';

@Component({
  imports: [
    FormsModule,
    Decimal64p2Pipe,
    IonAccordion,
    IonItem,
    IonLabel,
    TitleCasePipe,
    IonButtons,
    IonButton,
    CurrencyPipe,
    IonList,
    IonText,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './budget-period.component.scss',
  selector: 'sneat-budget-period',
  templateUrl: 'budget-period.component.html',
})
export class BudgetPeriodComponent {
  tab: 'by_event' | 'by_contact' = 'by_event';

  public readonly activePeriod = input.required<RepeatPeriod | undefined>();

  public readonly $showBy = input.required<ShowBy>();

  public readonly $period = input.required<RepeatPeriod>();
  public readonly $liabilitiesMode = input.required<LiabilitiesMode>();

  public readonly liabilitiesByPeriod = input<LiabilitiesByPeriod>();

  readonly showByChange = output<ShowBy>();

  protected periodLiabilities?: IPeriodLiabilities;

  protected readonly totalToBePaid = signal<IAmount[]>([]);

  constructor() {
    effect(() => {
      const period = this.$period();
      const liabilitiesByPeriod = this.liabilitiesByPeriod();
      this.periodLiabilities = period
        ? liabilitiesByPeriod?.[period]
        : undefined;
      if (this.periodLiabilities) {
        const total: IAmount[] = [];
        this.periodLiabilities.happenings.forEach((h) => {
          Object.entries(h.valuesByCurrency).forEach(([currency, value]) => {
            const i = total.findIndex((t) => t.currency === currency);
            if (i >= 0) {
              total[i] = { currency, value: total[i].value + value };
            } else {
              total.push({ currency, value });
            }
          });
        });
        this.totalToBePaid.set(total);
      }
    });
  }

  protected getAmounts(liability: ILiabilityBase): readonly IAmount[] {
    const result: IAmount[] = [];
    Object.entries(liability.valuesByCurrency).forEach(([currency, value]) => {
      result.push({ currency, value });
    });
    return result;
  }

  protected changeShowBy(showBy: 'event' | 'contact', event: Event): boolean {
    event.stopPropagation();
    event.preventDefault();
    this.showByChange.emit(showBy);
    return false;
  }
}
