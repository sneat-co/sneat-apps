import { ITitledRecord, IWithTeamIDs } from './dto-models';
import {
	LiabilityDirection,
	LiabilityServiceType,
	LiabilityType,
	Period,
} from './types';

export interface DtoLiability extends IWithTeamIDs, ITitledRecord {
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
