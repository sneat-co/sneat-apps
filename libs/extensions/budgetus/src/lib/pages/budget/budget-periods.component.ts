import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Period } from '@sneat/dto';
import {
	ICalendarHappeningBrief,
	RepeatPeriod,
} from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { IHappeningLiability } from './budget-components-types';
import { BudgetPeriodComponent } from './budget-period.component';
import { LiabilitiesMode } from './budget-types';

@Component({
	selector: 'sneat-budget-periods',
	templateUrl: './budget-periods.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, BudgetPeriodComponent],
})
export class BudgetPeriodsComponent implements OnChanges {
	@Input({ required: true }) team: ITeamContext = { id: '' };
	@Input({ required: true }) recurringHappenings?: Record<
		string,
		ICalendarHappeningBrief
	>;
	@Input({ required: true }) liabilitiesMode: LiabilitiesMode = 'balance';

	@Input({ required: true }) period: RepeatPeriod = 'weekly';

	@Output() readonly periodChange = new EventEmitter<RepeatPeriod>();

	protected onPeriodChanged(event: Event): void {
		this.period = (event as CustomEvent).detail.value;
		this.periodChange.emit(this.period);
	}

	protected readonly happeningLiabilitiesByPeriod = signal<{
		[id: string]: readonly IHappeningLiability[];
	}>({}); // TODO: must be better way to define using strongly typed key?

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['recurringHappenings']) {
			this.updateHappeningLiabilitiesByPeriod(this.recurringHappenings);
		}
	}

	private updateHappeningLiabilitiesByPeriod(
		recurringHappenings?: Record<string, ICalendarHappeningBrief>,
	): void {
		console.log('updateHappeningLiabilitiesByPeriod()');
		if (!recurringHappenings) {
			this.happeningLiabilitiesByPeriod.set({});
			return;
		}
		const byPeriod: {
			[id: string]: IHappeningLiability[];
		} = {};

		Object.entries(recurringHappenings).forEach((entry) => {
			const [id, brief] = entry;

			const slots =
				brief.slots?.filter(
					(s) => s.repeats === 'weekly' || s.repeats === 'monthly',
				) || [];

			slots.forEach((slot) => {
				const periodLiabilities = byPeriod[slot.repeats] || [];
				let liability = periodLiabilities.find((l) => l.happening.id === id);
				if (!liability) {
					liability = {
						happening: { id, brief, team: this.team },
						valuesByCurrency: {},
					};
				}

				const prices = brief.prices?.filter((p) => p.expenseQuantity) || [];

				if (prices.length && slots.length) {
					for (let priceIdx = 0; priceIdx < (prices.length || 0); priceIdx++) {
						const price = prices[priceIdx];
						if (this.period === 'weekly' && slot.weekdays) {
							for (
								let wdIdx = 0;
								wdIdx < (slot?.weekdays?.length || 0);
								wdIdx++
							) {
								let amountValue: number =
									liability.valuesByCurrency[price.amount.currency] || 0;
								amountValue += price.amount.value;
								liability = {
									...liability,
									valuesByCurrency: {
										...liability?.valuesByCurrency,
										[price.amount.currency]: amountValue,
									},
								};
							}
						}
					}
				}

				if (
					!periodLiabilities.some(
						(l) => l.happening.id === liability.happening.id,
					)
				) {
					periodLiabilities.push(liability);
					byPeriod[slot.repeats] = periodLiabilities;
				}
			});
		});

		this.happeningLiabilitiesByPeriod.set(byPeriod);
	}
}
