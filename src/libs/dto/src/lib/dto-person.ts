import { excludeUndefined } from '@sneat/core';
import { AgeGroup, Gender } from './types';

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
		n = {first, middle, last, full};
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

export interface IPersonBase {
	readonly name: IName;
	readonly userID?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroup;
}

export const emptyPersonBase: IPersonBase = { name: {} };

export interface IPersonBrief extends IPersonBase {
	readonly id: string;
}

export interface IPerson extends IPersonBase {
	readonly email?: string;
	readonly emails?: IEmail[];
	readonly phone?: string;
	readonly phones?: IPhone[];
	readonly website?: string;
	readonly dob?: string;  // Date of birth
}

export interface IRelatedPerson extends IPerson {
	readonly relationship?: string; // relative to current user
	readonly roles?: string[]; // Either member roles or contact roles
}

// // Default value: 'optional'
export type RequirementOption = 'required' | 'optional' | 'excluded';

export interface IPersonRequirements {
	readonly ageGroup?: RequirementOption;
	readonly gender?: RequirementOption;
	readonly phone?: RequirementOption;
	readonly email?: RequirementOption;
	readonly relatedAs?: RequirementOption;
	readonly roles?: RequirementOption;
}

export function isPersonNotReady(p: IPerson, requires: IPersonRequirements): boolean {
	return !!requires.ageGroup && !p.ageGroup || isNameEmpty(p.name);
}

export function isRelatedPersonNotReady(p: IRelatedPerson, requires: IPersonRequirements): boolean {
	return isPersonNotReady(p, requires);
}

export const emptyRelatedPerson = emptyPersonBase;

export function relatedPersonToPerson(v: IRelatedPerson): IPerson {
	const v2 = { ...excludeUndefined(v) } as any;
	delete v2['relationship'];
	return v2;
}
