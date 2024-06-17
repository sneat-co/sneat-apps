import { IByUser } from '@sneat/dto';
import { IHappeningSlot, ITiming } from './happening';

export interface ICancellation {
	readonly at: string;
	readonly by: IByUser;
}

export interface ISlotAdjustment {
	readonly cancellation?: ICancellation;
	readonly timing?: ITiming;
}

export interface IHappeningAdjustment {
	readonly slots: Readonly<Record<string, ISlotAdjustment>>;
}

export interface ICalendarDayBrief {
	readonly teamID: string;
	readonly date: string;
	readonly happeningIDs?: string[];
	readonly happeningAdjustments: Readonly<Record<string, IHappeningAdjustment>>;
}

export type ICalendarDayDto = ICalendarDayBrief;
