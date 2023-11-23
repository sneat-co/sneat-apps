import { IFormField } from '@sneat/core';
import { IContact2Asset } from './contact2item';
import { IContactBase } from './contact-base';
import { IWithRelatedAndRelatedIDs, TeamMemberType } from '@sneat/dto';
import { IMemberPerson, IPersonRecord } from './person';

export interface IName {
	readonly first?: string;
	readonly last?: string;
	readonly middle?: string;
	readonly nick?: string;
	readonly full?: string;
}

export function isNameEmpty(n?: IName): boolean {
	// noinspection UnnecessaryLocalVariableJS
	const result =
		!n ||
		(!n.full?.trim() &&
			!n.first?.trim() &&
			!n.last?.trim() &&
			!n.middle?.trim() &&
			!n.nick?.trim());
	return result;
}

export function trimNames(n: IName): IName {
	const first = n.first?.trim(),
		middle = n.middle?.trim(),
		last = n.last?.trim(),
		full = n.full?.trim();
	if (
		first !== n?.first ||
		last !== n?.last ||
		middle != n.middle ||
		full != n.full
	) {
		n = { first, middle, last, full };
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
	| typeof ContactTypeVehicle;

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
