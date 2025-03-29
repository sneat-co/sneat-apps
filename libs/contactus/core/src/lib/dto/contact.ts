import { ISpaceModuleItemRef, IWithRelatedAndRelatedIDs } from '@sneat/dto';
import { IContactBase } from './contact-base';
import { IContact2Asset } from './contact2item';
import { IPersonRecord } from './person';

export interface IRelatedRolesRequest {
	readonly rolesOfItem?: string[];
	readonly rolesToItem?: string[];
}

export interface IRelatedToRequest {
	readonly itemRef: ISpaceModuleItemRef;
	readonly add?: IRelatedRolesRequest;
	readonly remove?: IRelatedRolesRequest;
}

// // Default value: 'optional'
export type RequirementOption = 'required' | 'optional' | 'excluded';

export interface IContactBrief extends IContactBase {
	readonly parentID?: string;
}

export interface IContactDbo
	extends IContactBase,
		IPersonRecord,
		IWithRelatedAndRelatedIDs {
	readonly assets?: IContact2Asset[]; // TODO: Remove as it can be replaced with IWithRelatedItems?
}

export interface IContactsBrief {
	readonly contacts?: readonly IContactBrief[];
}
