import { IByUser } from '@sneat/meeting';

export interface ICanceled {
	at: string;
	by: IByUser;
}

export interface IRecurringHappeningCancellation {
	happeningID: string;
	slotIDs: string[];
	canceled: ICanceled;
	reason?: string;
}

export interface IScheduleDayDto {
	teamID: string;
	date: string;
	happeningIDs?: string[];
	cancellations: IRecurringHappeningCancellation[];
}
