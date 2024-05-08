import { IHappeningContext } from '@sneat/mod-schedulus-core';

export interface IHappeningLiability {
	readonly valuesByCurrency: { [id: string]: number };

	// readonly slots: readonly IHappeningSlot[];
	readonly happening: IHappeningContext;
	// readonly prices: readonly IHappeningPrice[];
}

export type LiabilitiesMode = 'incomes' | 'expenses' | 'balance';

export type HappeningLiabilitiesByPeriod = {
	// TODO: must be better way to define using strongly typed key?
	[id: string]: IHappeningLiability[];
};
