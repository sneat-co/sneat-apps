import { ITitledRecord, IWithTeamIDs, Period } from '@sneat/dto';

export type LiabilityType =
	| 'salary'
	| 'service'
	| 'tax'
	| 'education'
	| 'childcare'
	| 'mortgage'
	| 'rent'
	| 'insurance';
export type DwellingTaxServiceType = 'lpt';
export type VehicleServiceType = 'roadtax' | 'nct';
export type EntertainmentServiceType = 'tv' | 'music';
export type EducationServiceType = 'class';
export type DwellingServiceType =
	| 'electricity'
	| 'gas'
	| 'oil'
	| 'waste_removal'
	| 'internet'
	| 'phone'
	| 'tv'
	| 'tv_license';

export type SettlementType = 'rural' | 'urban';

export type LiabilityServiceType =
	| DwellingServiceType
	| DwellingTaxServiceType
	| EntertainmentServiceType
	| EducationServiceType
	| VehicleServiceType;
export type ServiceCategory = 'service' | 'tax';

export type LiabilityDirection = 'expense' | 'income';

export interface DtoLiability extends IWithTeamIDs, ITitledRecord {
	// memberId?: string;
	// contactId?: string;
	// assetId?: string;
	type: LiabilityType;
	direction: LiabilityDirection;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: { id: string; title: string };
	amount: number;
	period: Period;
}
