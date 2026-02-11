import { SpaceType } from '@sneat/core';

export { SpaceMemberType } from '@sneat/auth-models';

export type Restriction = 'adults_only' | 'personal' | string;

export type SneatRecordStatus = 'active' | 'archived' | 'deleted';

export type CommuneType = SpaceType;

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
