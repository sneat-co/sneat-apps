import { ICalendarHappeningBrief } from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { HappeningLiabilitiesByPeriod } from './budget-component-types';

export function getHappeningLiabilitiesByPeriod(
	recurringHappenings: Record<string, ICalendarHappeningBrief>,
	team: ITeamContext,
): HappeningLiabilitiesByPeriod {
	const byPeriod: HappeningLiabilitiesByPeriod = {};

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
					happening: { id, brief, team },
					valuesByCurrency: {},
				};
			}

			const prices = brief.prices?.filter((p) => p.expenseQuantity) || [];

			if (prices.length && slots.length) {
				for (let priceIdx = 0; priceIdx < (prices.length || 0); priceIdx++) {
					const price = prices[priceIdx];
					if (slot.repeats === 'weekly' && slot.weekdays) {
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
	return byPeriod;
}
