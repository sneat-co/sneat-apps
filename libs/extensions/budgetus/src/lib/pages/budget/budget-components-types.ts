import {
	CurrencyCode,
	IHappeningContext,
	IHappeningPrice,
	IHappeningSlot,
} from '@sneat/mod-schedulus-core';

export interface IHappeningLiability {
	readonly valuesByCurrency: { [id: string]: number };

	// readonly slots: readonly IHappeningSlot[];
	readonly happening: IHappeningContext;
	// readonly prices: readonly IHappeningPrice[];
}
