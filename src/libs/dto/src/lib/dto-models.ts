/* tslint:disable:no-bitwise */
import { IRecord, RxRecordKey } from '@sneat/rxstore';
import { IPerson } from './dto-person';
import { AgeGroup, Gender, Restriction } from './types';

// import {IPersonSize} from '../ui/dto-sizechart';

export interface ITitled {
	title: string;
}

export interface ITitledRecord extends IRecord {
	title?: string;
}

export interface ITitledRecordInfo {
	id: RxRecordKey;
	title: string;
}

// | MemberRoleWork;

export interface DtoTotal {
	count: number;
	day?: number;
	week?: number;
	month?: number;
	quarter?: number;
	year?: number;
}

export interface IDemoRecord extends IRecord {
	isDemo?: boolean;
	isLocal?: boolean;
}

export interface ITotalsHolder {
	totals?: DtoTotals;
}

export interface DtoTotals {
	incomes?: DtoTotal;
	expenses?: DtoTotal;
}


// export interface Category extends ITitledRecord {
//     id: string;
// }

export interface ITeamRecord {
	teamID?: string;
}

export interface IWithTeamIDs {
	teamIDs?: string[];
}

export interface IWithAssetIDs {
	assetIDs?: string[];
}

export interface IWithMemberIDs {

}

// eslint-disable-next-line
export interface ITeamsRecord extends IWithTeamIDs { // TODO: fix it
}

export interface IRealEstate {
	leaseExpires?: string;
}

export interface IWithRestrictions {
	restrictions?: Restriction[];
}

function newTotal(): DtoTotal {
	return { count: 0, day: 0, week: 0, month: 0, quarter: 0, year: 0 };
}

export function newTotals(): DtoTotals { // TODO: Rename to ITotalsDto
	return { incomes: newTotal(), expenses: newTotal() };
}

export function zeroIfEmptyTotals(totals: DtoTotals): DtoTotals {
	const f = (t?: DtoTotal) => t ? {
		count: t.count || 0,
		day: t.day || 0,
		week: t.week || 0,
		month: t.month || 0,
		quarter: t.quarter || 0,
		year: t.year || 0,
	} : newTotal();
	totals.incomes = f(totals.incomes);
	totals.expenses = f(totals.expenses);
	return totals;
}

export interface IPersonRecord extends ITeamsRecord, IPerson /*, IPersonSize*/
{
}

export interface IVerification {
	isVerified?: boolean;
	verification?: {
		confirmedBy?: string[]; // List of ID of users who confirmed validity of the member
		rejectedBy?: string[]; // List of ID of users who questions validity of the member
	};
}

