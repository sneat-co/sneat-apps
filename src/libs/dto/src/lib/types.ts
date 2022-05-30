import { TeamType } from '@sneat/auth-models';
import { ContactRole } from './contact-roles';

export {TeamType, MemberType} from '@sneat/auth-models';
export type MembersVisibility = 'private' | 'protected' | 'public';
export type WeekdayCode2 = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';
export type RepeatsWeek = 'week-1st' | 'week-2nd' | 'week-3d' | 'week-4th' | 'week-last';
export type Repeats = 'UNKNOWN' | 'once' | 'weekly' | RepeatsWeek | 'fortnightly' | 'monthly' | 'yearly';
export type ActivityType = 'appointment' | 'school' | 'lesson' | 'todo'; // TODO: Is it same as HappeningKind?
export type EventType = 'workshop' | 'fixture' | 'appointment';
export type SettlementType = 'rural' | 'urban';
export type AgeGroup = 'adult' | 'child' | 'undisclosed' | 'unknown';
export type Gender = 'male' | 'female' | 'undisclosed' | 'other' | 'unknown';
export type Restriction = 'adults_only' | 'personal' | string;

export type SneatRecordStatus = 'active' | 'archived' | 'deleted';
export type HappeningStatus = SneatRecordStatus;
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
export type AssetType =
	'undefined'
	| 'real_estate'
	| 'vehicle'
	| 'document'
	| 'debt'
	| 'misc';
export type Period = 'day' | 'week' | 'month' | 'quarter' | 'year';
export type VehicleType = 'car' | 'motorcycle' | 'boat';
export type FuelType = 'petrol' | 'diesel' | 'battery' | 'hydrogen';
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

export type ContactToMemberRelation = 'undefined' | 'parent' | 'mother' | 'father' | 'sibling' | 'childminder' | 'friend' | 'child';
export type ContactToAssetRelation = ContactRole;
