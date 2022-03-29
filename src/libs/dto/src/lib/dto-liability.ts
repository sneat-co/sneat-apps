import { LiabilityDirection, LiabilityServiceType, LiabilityType, Period } from './types';
import { ICommuneRecord, ITitledRecord } from './dto-models';

export interface DtoLiability extends ICommuneRecord, ITitledRecord {
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
