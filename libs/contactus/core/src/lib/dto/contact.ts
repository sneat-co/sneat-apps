import { IFormField } from '@sneat/core';
import { IContact2Asset } from './contact2item';
import { IContactBase } from './contact-base';
import { IWithRelatedAndRelatedIDs, TeamMemberType } from '@sneat/dto';
import { IMemberPerson, IPersonRecord } from './person';

export interface IPersonNames {
	readonly firstName?: string;
	readonly lastName?: string;
	readonly middleName?: string;
	readonly nickName?: string;
	readonly fullName?: string;
}

export function isNameEmpty(n?: IPersonNames): boolean {
	// noinspection UnnecessaryLocalVariableJS
	const result =
		!n ||
		(!n.fullName?.trim() &&
			!n.firstName?.trim() &&
			!n.lastName?.trim() &&
			!n.middleName?.trim() &&
			!n.nickName?.trim());
	return result;
}

export function trimNames(n: IPersonNames): IPersonNames {
	const first = n.firstName?.trim(),
		middle = n.middleName?.trim(),
		last = n.lastName?.trim(),
		full = n.fullName?.trim();
	if (
		first !== n?.firstName ||
		last !== n?.lastName ||
		middle != n.middleName ||
		full != n.fullName
	) {
		n = {
			firstName: first,
			middleName: middle,
			lastName: last,
			fullName: full,
		};
	}
	return n;
}

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
	| TeamMemberType
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

export interface IRelatedToRequest {
	readonly teamID: string;
	readonly moduleID: string;
	readonly collection: string;
	readonly itemID: string;
	readonly add?: {
		readonly relatedAs?: string[];
		readonly relatesAs?: string[];
	};
	readonly remove?: {
		readonly relatedAs?: string[];
		readonly relatesAs?: string[];
	};
}

export const emptyContactBase: IContactBase = {
	type: '' as ContactType,
	name: {},
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
