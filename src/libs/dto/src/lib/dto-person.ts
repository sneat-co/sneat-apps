import { AgeGroup, Gender } from './types';

export interface IName {
	readonly first?: string;
	readonly last?: string;
	readonly middle?: string;
	readonly full?: string;
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

export const emptyPersonBase: IPersonBase = {name: {}};

export interface IPersonBrief extends IPersonBase {
	readonly id: string
}

export interface IPerson extends IPersonBase {
	readonly email?: string;
	readonly phone?: string;
	readonly emails?: IEmail[];
	readonly phones?: IEmail[];
	readonly website?: string;
	readonly dob?: string;  // Date of birth
}

export interface IMyPerson extends IPerson {
	readonly relationship?: string; // relative to current user
	readonly roles?: string[]; // Either member roles or contact roles
}

export function myPersonToPerson(v: IMyPerson): IPerson {
	const v2 = {...v} as any;
	delete v2['relationship'];
	return v2;
}
