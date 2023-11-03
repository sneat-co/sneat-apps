import { IPrice, ITitledRecord, IWithTeamIDs } from '@sneat/dto';

export interface DtoTerm extends IWithTeamIDs, ITitledRecord {
	status: 'active' | 'archived';
	startsOn: string;
	endsOn: string;
	weeks?: number;
	classesTotal?: number;
	classesPerWeek?: number;
	prices?: ITermPrice[];
}

export interface DtoGroupTerms {
	current?: DtoTerm;
	next?: DtoTerm;
	prev?: DtoTerm;
}

export interface ITermPrice extends IPrice {
	title: string;
	description?: string;
	numberOfClasses?: number; // -1 => unlimited
}

export interface ITermCustomer {
	memberId: string;
	paid: boolean;
}
