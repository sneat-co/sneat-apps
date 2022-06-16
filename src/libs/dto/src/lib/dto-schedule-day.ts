import { IByUser } from '@sneat/meeting';
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

export interface IScheduleDayDto {
	teamID: string;
	date: string;
	happeningIDs?: string[];
	happeningAdjustments: IHappeningAdjustment[];
}
