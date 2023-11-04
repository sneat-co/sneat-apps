import { ITitledRecord } from '@sneat/dto';

export interface IReminderDto extends ITitledRecord {
	dueOn: string;
	dueTimes?: number;
	assetId?: string;
	liabilityId?: string;
	contactIds?: string[];
	memberIds?: string[];
}
