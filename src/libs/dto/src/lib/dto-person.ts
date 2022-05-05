import { AgeGroup, Gender } from '@sneat/dto';

export interface IName {
	first?: string;
	last?: string;
	middle?: string;
	full?: string;
}

export interface IPerson {
	name: IName;
	gender: Gender;
	ageGroup: AgeGroup;
	email?: string;
	phone?: string;
}
