import { IWithIdAndTitle } from '@sneat/dto';

export type ContactToContactRelation =
	| 'undefined'
	| 'parent'
	| 'mother'
	| 'father'
	| 'sibling'
	| 'childminder'
	| 'friend'
	| 'child';

export type ContactToAssetRelation = string;

// This is a DTO object to be used in request and NOT to be used in DB records
export interface IContact2ContactInRequest {
	relation: ContactToContactRelation;
}

export interface IContact2Asset extends IWithIdAndTitle {
	// TODO: Remove deprecated
	relation: ContactToAssetRelation;
}
