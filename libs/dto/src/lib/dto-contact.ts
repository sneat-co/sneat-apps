import { IAvatar } from '@sneat/auth-models';
import { IFormField } from '@sneat/core';
import { excludeUndefined } from '@sneat/core';
import { IAddress } from './dto-address';
import { IContact2Asset } from './dto-contact2item';
import { IPersonRecord } from './dto-models';
import { IWithCreatedOn } from './dto-with-modified';
import { PetKind } from './pet-kind';
import { AgeGroupID, Gender, TeamMemberType } from './types';

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
	readonly moduleID: string;
	readonly collection: string;
	readonly itemID: string;
	readonly relatedAs: string;
}

export interface IContactBase {
	readonly type: ContactType;
	readonly title?: string;
	readonly shortTitle?: string;
	readonly name?: IName;
	readonly countryID?: string;
	readonly userID?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroupID;
	readonly petKind?: PetKind;
	readonly address?: IAddress;
	readonly avatar?: IAvatar;
	readonly roles?: readonly string[];
	readonly groupIDs?: readonly string[];
	readonly relatedAs?: string;
	readonly invitesCount?: string;
	readonly dob?: string; // Date of birth
}

export const emptyContactBase: IContactBase = {
	type: '' as ContactType,
	name: {},
};

export interface IPersonBrief extends IContactBase {}

export interface IPerson extends IContactBase {
	readonly email?: string; // TODO: Document how email is different from emails
	readonly emails?: IEmail[];
	readonly phone?: string; // TODO: Document how phone is different from phones
	readonly phones?: IPhone[];
	readonly website?: string;
}

export interface IRelatedPerson extends IPerson {
	// relatedAs to current user or a specific contact
	readonly relatedTo?: IRelatedToRequest; // relative to current user
	// readonly roles?: string[]; // Either member roles or contact roles
}

export interface IMemberPerson extends IRelatedPerson {
	type: MemberContactType;
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

export function isPersonNotReady(
	p: IPerson,
	requires: IPersonRequirements,
): boolean {
	const nameIsEmpty = isNameEmpty(p.name);
	const isMissingRequiredFields =
		(!!requires.lastName?.required && !p.name?.last) ||
		(!!requires.ageGroup?.required && !p.ageGroup) ||
		(!!requires.gender?.required && !p.gender);
	return nameIsEmpty || isMissingRequiredFields;
}

export function isPersonReady(
	p: IPerson,
	requires: IPersonRequirements,
): boolean {
	return !isPersonNotReady(p, requires);
}

export function isRelatedPersonNotReady(
	p: IRelatedPerson,
	requires: IPersonRequirements,
): boolean {
	return (
		isPersonNotReady(p, requires) ||
		(p.type !== 'animal' &&
			!!requires.relatedAs?.required &&
			!p.relatedTo?.relatedAs)
	);
}

export function isRelatedPersonReady(
	p: IPerson,
	requires: IPersonRequirements,
): boolean {
	return !isRelatedPersonNotReady(p, requires);
}

export const emptyMemberPerson = emptyContactBase as IMemberPerson;

export function relatedPersonToPerson(v: IRelatedPerson): IPerson {
	const v2 = { ...excludeUndefined(v) };
	delete v2['relatedTo'];
	return v2 as IPerson;
}

export interface IRelatedPersonContact extends IRelatedPerson {
	readonly type: 'person';
}

export interface ICreatePeronRequest extends IRelatedPersonContact {
	readonly status: 'active' | 'draft';
}

export interface IContactBrief extends IContactBase {
	readonly parentID?: string;
}

export interface IContactRelationship extends IWithCreatedOn {}

export type IContactRelationships = Readonly<{
	[relationshipID: string]: IContactRelationship;
}>;

export interface IRelatedContact {
	readonly relatedAs?: IContactRelationships; // if related contact is a child of the current contact, then relatedAs = {"child": ...}
	readonly relatesAs?: IContactRelationships; // if related contact is a child of the current contact, then relatesAs = {"parent": ...}
}

export type IRelatedContacts = Readonly<{
	[contactID: string]: IRelatedContact;
}>;

export interface IContactDto extends IContactBase, IPersonRecord {
	readonly assets?: IContact2Asset[]; // TODO: document purpose, use cases, examples of usage
	readonly relatedContacts?: IRelatedContacts;
}

export interface IContactsBrief {
	readonly contacts?: readonly IContactBrief[];
}
