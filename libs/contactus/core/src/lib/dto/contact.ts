import { IFormField } from '@sneat/core';
import { IContact2Asset } from './contact2item';
import { IContactBase } from './contact-base';
import {
	ISpaceModuleItemRef,
	IWithRelatedAndRelatedIDs,
	SpaceMemberType,
} from '@sneat/dto';
import { IMemberPerson, IPersonRecord } from './person';

export interface IEmail {
	readonly type: 'work' | 'personal';
	readonly address: string;
}

export interface IPhone {
	readonly type: 'work' | 'mobile' | 'personal' | 'fax';
	readonly number: string;
}

export const ContactTypePerson = 'person',
	ContactTypeCompany = 'company',
	ContactTypeLocation = 'location',
	ContactTypeAnimal = 'animal',
	ContactTypeVehicle = 'vehicle';

export type ContactType =
	| SpaceMemberType
	| typeof ContactTypePerson
	| typeof ContactTypeCompany
	| typeof ContactTypeLocation
	| typeof ContactTypeAnimal
	| typeof ContactTypeVehicle
	| 'landlord'
	| 'tenant';

export type MemberContactType =
	| typeof ContactTypePerson
	| typeof ContactTypeAnimal;

export interface IRelatedRolesRequest {
	readonly rolesOfItem?: string[];
	readonly rolesToItem?: string[];
}

export interface IRelatedToRequest {
	readonly itemRef: ISpaceModuleItemRef;
	readonly add?: IRelatedRolesRequest;
	readonly remove?: IRelatedRolesRequest;
}

export const emptyContactBase: IContactBase = {
	type: '' as ContactType,
	names: {},
};

// // Default value: 'optional'
export type RequirementOption = 'required' | 'optional' | 'excluded';

export interface IPersonRequirements {
	readonly lastName?: IFormField;
	readonly ageGroup?: IFormField;
	readonly gender?: IFormField;
	readonly phone?: IFormField;
	readonly email?: IFormField;
	readonly relatedAs?: IFormField;
	readonly roles?: IFormField;
}

export const emptyMemberPerson = emptyContactBase as IMemberPerson;

export interface IContactBrief extends IContactBase {
	readonly parentID?: string;
}

export interface IContactDto
	extends IContactBase,
		IPersonRecord,
		IWithRelatedAndRelatedIDs {
	readonly assets?: IContact2Asset[]; // TODO: Remove as it can be replaced with IWithRelatedItems?
}

export interface IContactsBrief {
	readonly contacts?: readonly IContactBrief[];
}
