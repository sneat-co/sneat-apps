import { TeamDay } from '@sneat/extensions/schedulus/shared';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';

export interface Weekday {
	// This is used to
	readonly id: WeekdayCode2;
	readonly longTitle: string;
	readonly day?: TeamDay; // TODO: make readonly
}
