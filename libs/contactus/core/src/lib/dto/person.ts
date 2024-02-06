import { isNameEmpty } from '@sneat/auth-models';
import { excludeUndefined } from '@sneat/core';
import { IWithRelatedOnly, IWithTeamIDs } from '@sneat/dto';
import {
	IEmail,
	IPhone,
	MemberContactType,
	IContactBase,
	IPersonRequirements,
	MemberRole,
} from '.';

export type IPersonBrief = IContactBase;

export interface IPerson extends IContactBase {
	readonly email?: string; // TODO: Document how email is different from emails
	readonly emails?: IEmail[];
	readonly phone?: string; // TODO: Document how phone is different from phones
	readonly phones?: IPhone[];
	readonly website?: string;
}

export interface ITeamMemberInfo extends IPerson {
	readonly id?: string;
	readonly userID?: string;
	readonly title?: string;
	readonly groupIDs?: readonly string[];
	readonly roles?: readonly MemberRole[];
}

export interface IRelatedPerson extends IPerson, IWithRelatedOnly {
	// relatedAs to current user or a specific contact
	// readonly roles?: string[]; // Either member roles or contact roles
}

export interface IMemberPerson extends IRelatedPerson {
	type: MemberContactType;
}

export function relatedPersonToPerson(v: IRelatedPerson): IPerson {
	const v2 = { ...excludeUndefined(v) };
	delete v2['related'];
	return v2 as IPerson;
}

export interface IRelatedPersonContact extends IRelatedPerson {
	readonly type: 'person';
}

export interface ICreatePeronRequest extends IRelatedPersonContact {
	readonly status: 'active' | 'draft';
}

export function isPersonNotReady(
	p: IPerson,
	requires: IPersonRequirements,
): boolean {
	const nameIsEmpty = isNameEmpty(p.names);
	const isMissingRequiredFields =
		(!!requires.lastName?.required && !p.names?.lastName) ||
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
		(p.type !== 'animal' && !!requires.relatedAs?.required && !p.related)
	);
}

export function isRelatedPersonReady(
	p: IPerson,
	requires: IPersonRequirements,
): boolean {
	return !isRelatedPersonNotReady(p, requires);
}

export interface IPersonRecord extends IWithTeamIDs, IPerson {
	/*, IPersonSize*/
}
