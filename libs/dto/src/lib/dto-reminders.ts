import { ITitledRecord } from './dto-models';

export interface DtoReminder extends ITitledRecord {
	dueOn: string;
	dueTimes?: number;
	assetId?: string;
	liabilityId?: string;
	contactIds?: string[];
	memberIds?: string[];
}
