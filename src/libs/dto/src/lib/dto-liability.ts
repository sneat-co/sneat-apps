import { LiabilityDirection, LiabilityServiceType, LiabilityType, Period } from './types';
import { ITeamsRecord, ITitledRecord } from './dto-models';

export interface DtoLiability extends ITeamsRecord, ITitledRecord {
	memberId?: string;
	contactId?: string;
	assetId?: string;
	type: LiabilityType;
	direction: LiabilityDirection;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: { id: string; title: string };
	amount: number;
	period: Period;
}
