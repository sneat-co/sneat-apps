import { TeamType } from '@sneat/core';

export { TeamMemberType } from '@sneat/auth-models';

export type Restriction = 'adults_only' | 'personal' | string;

export type SneatRecordStatus = 'active' | 'archived' | 'deleted';

export type CommuneType = TeamType;

export type CountryId =
	| 'IE'
	| 'US'
	| 'UK'
	| 'RU'
	| 'FR'
	| 'ES'
	| 'AU'
	| 'ZA'
	| string;

export type CommuneItemCounter =
	| 'activities'
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
