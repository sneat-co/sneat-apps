import { TeamType } from '@sneat/core';

export { TeamMemberType } from '@sneat/auth-models';
export type MembersVisibility = 'private' | 'protected' | 'public';
export type WeekdayCode2 = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';
export type RepeatsWeek = 'week-1st' | 'week-2nd' | 'week-3d' | 'week-4th' | 'week-last';
export type Repeats = 'UNKNOWN' | 'once' | 'weekly' | RepeatsWeek | 'fortnightly' | 'monthly' | 'yearly';
export type ActivityType = 'appointment' | 'school' | 'lesson' | 'todo'; // TODO: Is it same as HappeningKind?
export type EventType = 'workshop' | 'fixture' | 'appointment';
export type SettlementType = 'rural' | 'urban';
export type AgeGroupID = 'adult' | 'child' | 'pet' | 'undisclosed' | 'unknown';


export const MemberGroupTypeAdults = 'adults';
export const MemberGroupTypeKids = 'kids';
export const MemberGroupTypePets = 'pets';
export const MemberGroupTypeOther = 'other';

export type MemberGroupType =
	| typeof MemberGroupTypeAdults
	| typeof MemberGroupTypeKids
	| typeof MemberGroupTypePets
	| typeof MemberGroupTypeOther;

export const GenderUndisclosed = 'undisclosed';
export const GenderUnknown = 'unknown';
export const GenderMale = 'male';
export const GenderFemale = 'female';
export const GenderOther = 'other';

export type Gender =
	| typeof GenderUndisclosed
	| typeof GenderUnknown
	| typeof GenderMale
	| typeof GenderFemale
	| typeof GenderOther;

export type Restriction = 'adults_only' | 'personal' | string;

export type SneatRecordStatus = 'active' | 'archived' | 'deleted';
export type ListStatus = SneatRecordStatus;

export type CommuneType = TeamType;

export type CountryId = 'IE' | 'US' | 'UK' | 'RU' | 'FR' | 'ES' | 'AU' | 'ZA' | string;
export type LiabilityType =
	'salary'
	| 'service'
	| 'tax'
	| 'education'
	| 'childcare'
	| 'mortgage'
	| 'rent'
	| 'insurance';
export type LiabilityDirection = 'expense' | 'income';
export type DwellingTaxServiceType = 'lpt';
export type VehicleServiceType = 'roadtax' | 'nct';
export type EntertainmentServiceType = 'tv' | 'music';
export type EducationServiceType = 'class';
export type DwellingServiceType =
	'electricity'
	| 'gas'
	| 'oil'
	| 'waste_removal'
	| 'internet'
	| 'phone'
	| 'tv'
	| 'tv_license';

export type LiabilityServiceType =
	| DwellingServiceType
	| DwellingTaxServiceType
	| EntertainmentServiceType
	| EducationServiceType
	| VehicleServiceType
	;
export type ServiceCategory = 'service' | 'tax';

export type AssetStatus = 'active' | 'archived' | 'draft';

export type AssetCategory =
	'undefined'
	| 'real_estate'
	| 'vehicle'
	| 'document'
	| 'debt'
	| 'misc';

export type AssetVehicleType =
	'aircraft' |
	'bicycle' |
	'boat' |
	'bus' |
	'car' |
	'helicopter' |
	'motorcycle' |
	'truck' |
	'van'
	;
export type AssetRealEstateType = 'house' | 'apartment' | 'land';

export type AssetType = AssetVehicleType | AssetRealEstateType;

export type Period = 'day' | 'week' | 'month' | 'quarter' | 'year';

export const EngineTypeUnknown = '';
export const EngineTypeOther = 'other';
export const EngineTypePHEV = 'phev';
export const EngineTypeCombustion = 'combustion';
export const EngineTypeElectric = 'electric';
export const EngineTypeHybrid = 'hybrid';
export const EngineTypeSteam = 'steam';

export type EngineType =
	typeof EngineTypeUnknown |
	typeof EngineTypeOther |
	typeof EngineTypePHEV |
	typeof EngineTypeCombustion |
	typeof EngineTypeElectric |
	typeof EngineTypePHEV |
	typeof EngineTypeHybrid |
	typeof EngineTypeSteam;

export enum EngineTypes {
	unknown = '',
	other = 'other',
	phev = 'phev',
	combustion = 'combustion',
	electric = 'electric',
	hybrid = 'hybrid',
	steam = 'steam',
}

export const FuelTypeUnknown = '';
export const FuelTypeOther = 'other';
export const FuelTypePetrol = 'petrol';
export const FuelTypeDiesel = 'diesel';
export const FuelTypeHydrogen = 'hydrogen';
export const FuelTypeElectricity = 'electricity';

export type FuelType =
	typeof FuelTypeUnknown |
	typeof FuelTypeOther |
	typeof FuelTypePetrol |
	typeof FuelTypeDiesel |
	typeof FuelTypeHydrogen |
	typeof FuelTypeElectricity;

export enum FuelTypes {
	unknown = '', // unknown
	other = 'other',
	petrol = 'petrol',
	diesel = 'diesel',
	hydrogen = 'hydrogen',
	electricity = 'electricity',
}

export type CommuneItemCounter =
	'activities'
	| 'assets'
	| 'assetGroups'
	| 'contacts'
	| 'documents'
	| 'liabilities'
	| 'members'
	| 'memberGroups'
	| 'overdues'
	| 'regularTasks'
	| 'todos'
	| 'upcomings';

export type ContactToContactRelation =
	'undefined'
	| 'parent'
	| 'mother'
	| 'father'
	| 'sibling'
	| 'childminder'
	| 'friend'
	| 'child';

export type ContactToAssetRelation = string;

export const
	AssetPossessionUndisclosed = 'undisclosed',
	AssetPossessionOwning = 'owning',
	AssetPossessionRenting = 'renting',
	AssetPossessionLeasing = 'leasing';

export type AssetPossession =
	| typeof AssetPossessionUndisclosed
	| typeof AssetPossessionOwning
	| typeof AssetPossessionRenting
	| typeof AssetPossessionLeasing;

export const AssetPossessions: AssetPossession[] = [
	AssetPossessionOwning,
	AssetPossessionRenting,
	AssetPossessionLeasing,
	AssetPossessionUndisclosed,
];
