import { IContactContext } from '@sneat/contactus-core';
import { IHappeningContext, RepeatPeriod } from '@sneat/mod-schedulus-core';

export type LiabilitiesMode = 'incomes' | 'expenses' | 'balance';

export type AmountsByCurrency = { [id: string]: number };

export interface ILiabilityBase {
	readonly valuesByCurrency: AmountsByCurrency;
}

export interface IHappeningLiability extends ILiabilityBase {
	readonly happening: IHappeningContext;
}

export interface PeriodLiabilities {
	readonly happenings: IHappeningLiability[];
	readonly contacts: IContactLiability[];
}

export type LiabilitiesByPeriod = Partial<
	Record<RepeatPeriod, PeriodLiabilities>
>;

export interface IContactLiability extends ILiabilityBase {
	readonly contact: IContactContext;
}
