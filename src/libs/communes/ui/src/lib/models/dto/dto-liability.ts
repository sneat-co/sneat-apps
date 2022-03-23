import { LiabilityDirection, LiabilityServiceType, LiabilityType, Period } from '../types';
import { ICommuneRecord, ITitledRecord } from './dto-models';
import { RxRecordKey } from 'rxstore';

export interface DtoLiability extends ICommuneRecord, ITitledRecord {
	memberId?: RxRecordKey;
	contactId?: RxRecordKey;
	assetId?: RxRecordKey;
	type: LiabilityType;
	direction: LiabilityDirection;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: { id: RxRecordKey; title: string };
	amount: number;
	period: Period;
}
