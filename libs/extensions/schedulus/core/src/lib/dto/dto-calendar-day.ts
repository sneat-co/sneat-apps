import { IByUser } from '@sneat/dto';
import { IHappeningSlot } from './happening';

export interface ICanceled {
	at: string;
	by: IByUser;
}

export interface IHappeningAdjustment {
	happeningID: string;
	slot: IHappeningSlot;
	canceled?: ICanceled;
}

export interface ICalendarDayBrief {
	teamID: string;
	date: string;
	happeningIDs?: string[];
	happeningAdjustments: IHappeningAdjustment[];
}

export type ICalendarDayDto = ICalendarDayBrief;
