import { IIdAndBrief } from '@sneat/core';
import {
	ICalendarHappeningBrief,
	IHappeningPrice,
	IHappeningSlot,
} from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import {
	IHappeningLiability,
	LiabilitiesByPeriod,
	PeriodLiabilities,
} from './budget-component-types';

export function getLiabilitiesByPeriod(
	recurringHappenings: Record<string, ICalendarHappeningBrief>,
	team: ITeamContext,
): LiabilitiesByPeriod {
	const byPeriod: LiabilitiesByPeriod = {};

	Object.entries(recurringHappenings).forEach((entry) => {
		const [id, brief] = entry;
		processHappening(team, byPeriod, { id, brief });
	});
	return byPeriod;
}

function processHappening(
	team: ITeamContext,
	byPeriod: LiabilitiesByPeriod,
	happening: IIdAndBrief<ICalendarHappeningBrief>,
): void {
	const slots =
		happening.brief.slots?.filter(
			(s) => s.repeats === 'weekly' || s.repeats === 'monthly',
		) || [];

	slots.forEach((slot) => {
		processSlot(team, byPeriod, happening, slot);
	});
}

function processSlot(
	team: ITeamContext,
	byPeriod: LiabilitiesByPeriod,
	happening: IIdAndBrief<ICalendarHappeningBrief>,
	slot: IHappeningSlot,
): void {
	const liabilities: PeriodLiabilities = byPeriod[slot.repeats] || {
		happenings: [],
		contacts: {},
	};
	byPeriod[slot.repeats] = liabilities;
	const hLiabilityIndex = liabilities.happenings.findIndex(
		(l) => l.happening.id === happening.id,
	);
	let hLiability: IHappeningLiability =
		hLiabilityIndex >= 0
			? liabilities.happenings[hLiabilityIndex]
			: {
					happening: { ...happening, team },
					valuesByCurrency: {},
				};

	const prices = happening.brief.prices?.filter((p) => p.expenseQuantity) || [];

	if (prices.length) {
		for (let priceIdx = 0; priceIdx < (prices.length || 0); priceIdx++) {
			const price = prices[priceIdx];
			hLiability = processPrice(hLiability, slot, price);
		}
		if (hLiabilityIndex >= 0) {
			liabilities.happenings[hLiabilityIndex] = hLiability;
		} else {
			liabilities.happenings.push(hLiability);
		}
	}
}

function processPrice(
	happeningLiability: IHappeningLiability,
	slot: IHappeningSlot,
	price: IHappeningPrice,
): IHappeningLiability {
	if (slot.repeats === 'weekly' && slot.weekdays) {
		for (let wdIdx = 0; wdIdx < (slot?.weekdays?.length || 0); wdIdx++) {
			let amountValue: number =
				happeningLiability.valuesByCurrency[price.amount.currency] || 0;
			amountValue += price.amount.value;
			happeningLiability = {
				...happeningLiability,
				valuesByCurrency: {
					...happeningLiability?.valuesByCurrency,
					[price.amount.currency]: amountValue,
				},
			};
		}
	}
	return happeningLiability;
}
