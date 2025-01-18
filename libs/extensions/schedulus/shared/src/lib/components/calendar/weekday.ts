import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { SpaceDay } from '../../services/space-day';

export interface Weekday {
	// This is used to
	readonly id: WeekdayCode2;
	readonly longTitle: string;
	readonly day?: SpaceDay;
}
