import { IIdAndBrief } from '@sneat/core';
import {
	ICalendarHappeningBrief,
	IHappeningPrice,
	IHappeningSlot,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/space-models';
import {
	IHappeningLiability,
	LiabilitiesByPeriod,
	IPeriodLiabilities,
	LiabilitiesMode,
} from './budget-component-types';

export function getLiabilitiesByPeriod(
	liabilitiesMode: LiabilitiesMode,
	recurringHappenings: Record<string, ICalendarHappeningBrief>,
	space: ISpaceContext,
): LiabilitiesByPeriod {
	const byPeriod: LiabilitiesByPeriod = {};

	Object.entries(recurringHappenings).forEach((entry) => {
		const [id, brief] = entry;
		processHappening(liabilitiesMode, space, byPeriod, { id, brief });
	});
	return byPeriod;
}

function processHappening(
	liabilitiesMode: LiabilitiesMode,
	space: ISpaceContext,
	byPeriod: LiabilitiesByPeriod,
	happening: IIdAndBrief<ICalendarHappeningBrief>,
): void {
	// console.log('budget.processHappening()', happening);
	Object.entries(happening.brief.slots || {}).forEach(([slotID, slot]) => {
		if (slot.repeats === 'weekly' || slot.repeats === 'monthly') {
			processSlot(liabilitiesMode, space, byPeriod, happening, slotID, slot);
		}
	});
}

function processSlot(
	liabilitiesMode: LiabilitiesMode,
	space: ISpaceContext,
	byPeriod: LiabilitiesByPeriod,
	happening: IIdAndBrief<ICalendarHappeningBrief>,
	slotID: string,
	slot: IHappeningSlot,
): void {
	let liabilities: IPeriodLiabilities = byPeriod[slot.repeats] || {
		happenings: [],
		contacts: [],
	};
	const hLiabilityIndex = liabilities.happenings.findIndex(
		(l) => l.happening.id === happening.id,
	);
	let hLiability: IHappeningLiability =
		hLiabilityIndex >= 0
			? liabilities.happenings[hLiabilityIndex]
			: {
					happening: { ...happening, space },
					valuesByCurrency: {},
				};

	const prices =
		happening.brief.prices?.filter(
			(p) =>
				(liabilitiesMode === 'expenses'
					? p.amount.value > 0
					: liabilitiesMode === 'incomes'
						? p.amount.value < 0
						: true) &&
				(p.expenseQuantity || p.term),
		) || [];

	if (prices.length) {
		for (let priceIdx = 0; priceIdx < (prices.length || 0); priceIdx++) {
			const price = prices[priceIdx];
			hLiability = { ...hLiability, priceAmount: price.amount };
			hLiability = processPrice(hLiability, slot, price, liabilities);
		}
		if (hLiabilityIndex >= 0) {
			liabilities = {
				...liabilities,
				happenings: liabilities.happenings.map((h) =>
					h.happening.id == hLiability.happening.id ? hLiability : h,
				),
			};
		} else {
			liabilities = {
				...liabilities,
				happenings: [...liabilities.happenings, hLiability],
			};
		}
	}
	byPeriod[slot.repeats] = liabilities;
}

function processPrice(
	happeningLiability: IHappeningLiability,
	slot: IHappeningSlot,
	price: IHappeningPrice,
	liabilities: IPeriodLiabilities,
): IHappeningLiability {
	if (slot.repeats === 'weekly' && slot.weekdays) {
		happeningLiability = { ...happeningLiability, times: slot.weekdays.length };
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
			const happeningContacts =
				happeningLiability.happening.brief?.related?.['contactus']?.[
					'contacts'
				] || {};
			Object.keys(happeningContacts).forEach((itemID) => {
				let contactLiability = liabilities.contacts.find(
					(c) => c.contact.id == itemID,
				);
				if (!contactLiability) {
					contactLiability = {
						contact: {
							id: itemID,
							space: happeningLiability.happening.space,
						},
						valuesByCurrency: {},
					};
				}
				contactLiability.valuesByCurrency[price.amount.currency] =
					(contactLiability.valuesByCurrency[price.amount.currency] || 0) +
					price.amount.value;
				liabilities = {
					...liabilities,
					contacts: [...liabilities.contacts, contactLiability],
				};
			});
		}
	}
	return happeningLiability;
}
