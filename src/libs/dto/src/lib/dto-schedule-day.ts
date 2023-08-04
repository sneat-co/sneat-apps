import { IByUser } from './by-user';
import { IHappeningSlot } from './dto-happening';

export interface ICanceled {
	at: string;
	by: IByUser;
}

export interface IHappeningAdjustment {
	happeningID: string;
	slot: IHappeningSlot;
	canceled?: ICanceled;
}

export interface IScheduleDayBrief {
	teamID: string;
	date: string;
	happeningIDs?: string[];
	happeningAdjustments: IHappeningAdjustment[];
}

export interface IScheduleDayDto extends IScheduleDayBrief {
}

