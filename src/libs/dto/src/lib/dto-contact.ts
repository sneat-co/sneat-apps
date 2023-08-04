import { IAvatar } from '@sneat/auth-models';
import { IFormField } from '@sneat/core';
import { excludeUndefined } from '@sneat/core';
import { ContactRole } from './contact-roles';
import { IAddress } from './dto-address';
import { IContact2Asset, IContact2Member } from './dto-contact2item';
import { IPersonRecord } from './dto-models';
import { AgeGroupID, Gender, MemberType } from './types';

export interface IName {
	readonly first?: string;
	readonly last?: string;
	readonly middle?: string;
	readonly full?: string;
}

export function isNameEmpty(n?: IName): boolean {
	return !n || !n.full && !n.first && !n.last && !n.middle;
}

export function trimNames(n: IName): IName {
	const
		first = n.first?.trim(),
		middle = n.middle?.trim(),
		last = n.last?.trim(),
		full = n.full?.trim();
	if (first !== n?.first || last !== n?.last || middle != n.middle || full != n.full) {
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

export const
	ContactTypePerson = 'person',
	ContactTypeCompany = 'company',
	ContactTypeLocation = 'location',
	ContactTypeAnimal = 'animal';

export type ContactType = MemberType
	| typeof ContactTypePerson
	| typeof ContactTypeCompany
	| typeof ContactTypeLocation
	| typeof ContactTypeAnimal;

export interface IContactBase {
	readonly type: ContactType;
	readonly title?: string;
	readonly name?: IName;
	readonly countryID?: string;
	readonly userID?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroupID;
	readonly address?: IAddress;
	readonly avatar?: IAvatar;
	readonly roles?: readonly string[];
	readonly groupIDs?: readonly string[];
}

export const emptyPersonBase: IContactBase = { type: '' as ContactType, name: {} };

export interface IPersonBrief extends IContactBase {
}

export interface IPerson extends IContactBase {
	readonly email?: string; // TODO: Document how email is different from emails
	readonly emails?: IEmail[];
	readonly phone?: string; // TODO: Document how phone is different from phones
	readonly phones?: IPhone[];
	readonly website?: string;
	readonly dob?: string;  // Date of birth
}

export interface IRelatedPerson extends IPerson {
	readonly relationship?: string; // relative to current user
	// readonly roles?: string[]; // Either member roles or contact roles
}

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

export function isPersonNotReady(p: IPerson, requires: IPersonRequirements): boolean {
	return isNameEmpty(p.name) ||
		!!requires.lastName?.required && !p.name?.last ||
		!!requires.ageGroup?.required && !p.ageGroup ||
		!!requires.gender?.required && !p.gender;
}

export function isPersonReady(p: IPerson, requires: IPersonRequirements): boolean {
	return !isPersonNotReady(p, requires);
}

export function isRelatedPersonNotReady(p: IRelatedPerson, requires: IPersonRequirements): boolean {
	return isPersonNotReady(p, requires) || !!requires.relatedAs?.required && !p.relationship;
}

export function isRelatedPersonReady(p: IPerson, requires: IPersonRequirements): boolean {
	return !isRelatedPersonNotReady(p, requires);
}

export const emptyRelatedPerson = emptyPersonBase;

export function relatedPersonToPerson(v: IRelatedPerson): IPerson {
	const v2 = { ...excludeUndefined(v) };
	delete v2['relationship'];
	return v2 as IPerson;
}

export interface IRelatedPersonContact extends IRelatedPerson {
	type: 'person';
}

export interface IContactBrief extends IContactBase {
	parentID?: string;
}

export interface IContactDto extends IContactBase, IPersonRecord {
	readonly roles?: ContactRole[];
	readonly members?: IContact2Member[]; // TODO: document purpose, use cases, examples of usage
	readonly assets?: IContact2Asset[];  // TODO: document purpose, use cases, examples of usage
	readonly relatedContacts?: IContactBrief[];
}

export interface IContactsBrief {
	contacts?: IContactBrief[];
}
