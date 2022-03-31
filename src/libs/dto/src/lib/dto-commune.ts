/* tslint:disable:no-bitwise */
import { EnumAsUnionOfKeys } from '@sneat/core';
import { RxRecordKey } from '@sneat/rxstore';
import { IListGroupsHolder } from './dto-list';
import { ICommuneDtoMemberGroupInfo, MemberRole } from './dto-member';
import { IDemoRecord, ITitledRecord, ITotalsHolder } from './dto-models';
import { AgeGroup, CommuneType, CountryId, Gender } from './types';

export const enum TeamCounter {
	activities = 'activities',
	assets = 'assets',
	assetGroups = 'assetGroups',
	contacts = 'contacts',
	documents = 'documents',
	liabilities = 'liabilities',
	members = 'members',
	// membersByRole = 'membersByRole',
	memberGroups = 'memberGroups',
	overdues = 'overdues',
	pupils = 'pupils',
	regularTasks = 'regularTasks',
	staff = 'staff',
	todos = 'todos',
	upcomings = 'upcomings',
}

type TeamCounters = {
	[P in EnumAsUnionOfKeys<typeof TeamCounter>]: number;
};

export interface TeamCounts {
	[TeamCounter.activities]?: number;
	[TeamCounter.assets]?: number;
	[TeamCounter.assetGroups]?: number;
	[TeamCounter.contacts]?: number;
	[TeamCounter.documents]?: number;
	[TeamCounter.regularTasks]?: number;
	[TeamCounter.liabilities]?: number;
	[TeamCounter.pupils]?: number;
	[TeamCounter.staff]?: number;
	[TeamCounter.members]?: number;
	[TeamCounter.memberGroups]?: number;
	[TeamCounter.overdues]?: number;
	[TeamCounter.todos]?: number;
	[TeamCounter.upcomings]?: number;
	// [CommuneCounter.membersByRole]?: { [role: string]: number }; this does not make sense here
}

export function incrementNumberOf<NumberOf, Dto extends { numberOf?: NumberOf }>(
	dto: Dto, init: () => NumberOf, counter: keyof NumberOf, v: number = 1): Dto {
	const current: number = (dto.numberOf && dto.numberOf[counter] || 0) as unknown as number;
	return {
		...dto,
		numberOf: {
			...(dto.numberOf || init()),
			[counter]: current + v,
		},
	};
}

export function newCommuneCounts(numberOf?: TeamCounts): TeamCounts {
	numberOf = numberOf || {};
	return {
		activities: numberOf.activities || 0,
		assets: numberOf.assets || 0,
		assetGroups: numberOf.assetGroups || 0,
		contacts: numberOf.contacts || 0,
		documents: numberOf.documents || 0,
		members: numberOf.members || 0,
		memberGroups: numberOf.memberGroups || 0,
		liabilities: numberOf.liabilities || 0,
		overdues: numberOf.overdues || 0,
		regularTasks: numberOf.regularTasks || 0,
		todos: numberOf.todos || 0,
		upcomings: numberOf.upcomings || 0,
	};
}

export interface ICommuneMemberInfo {
	readonly id?: string;
	readonly userId?: string;
	readonly title?: string;
	readonly gender?: Gender;
	readonly age?: AgeGroup;
	readonly groupIds?: readonly RxRecordKey[];
	readonly roles?: readonly MemberRole[];
}

export interface ICommuneDto extends IDemoRecord, ITitledRecord, ITotalsHolder, IListGroupsHolder {
	readonly countryId?: CountryId;
	readonly type: CommuneType;
	readonly desc?: string;
	readonly userId: RxRecordKey;
	readonly order?: number;
	readonly numberOf?: TeamCounts;
	readonly membersCountByRole?: { [id: string]: number };
	readonly noContactRoles?: string[];
	readonly groups?: ICommuneDtoMemberGroupInfo[];
	readonly members?: readonly ICommuneMemberInfo[];
}

export function isCommuneShouldHoldMembersInfo(type: CommuneType): boolean {
	return type === 'family' || type === 'cohabit';
}

export function findCommuneMemberInfo(
	members: readonly ICommuneMemberInfo[],
	member: { readonly id?: string; readonly userId?: string },
): ICommuneMemberInfo | undefined {
	return members && members.find(m => m && (!!m.id && m.id === member.id) || (!!m.userId && m.userId === member.userId));
}

export const personalCommuneIdPrefix = 'u_';

export function getUserPersonalCommuneId(userId?: string): string {
	if (!userId) {
		throw new Error('userId is required parameter');
	}
	return personalCommuneIdPrefix + userId;
}

export function isPersonalCommuneId(id: string): boolean {
	return !!id && id.startsWith(personalCommuneIdPrefix);
}

export function isUserPersonalCommune(communeId: string, userId?: string): boolean {
	return !!userId && communeId === getUserPersonalCommuneId(userId);
}

export const CommuneModel = {
	getListInfoByRealId: (dto: ICommuneDto, listId: string) => {
		const result = dto.listGroups && dto.listGroups
			.map(lg => lg.lists && lg.lists.find(l => l.id === listId))
			.find(l => !!l);
		console.log(`CommuneModel.getListInfoByRealId(${listId})`, dto.listGroups, ' => ', result);
		return result;
	},

	getListInfoByShortId: (dto: ICommuneDto, shortListId: string) => {
		console.log(`CommuneModel.getListInfoByShortId(${shortListId})`, dto.listGroups);
		return dto.listGroups && dto.listGroups
			.map(lg => lg.lists && lg.lists.find(l => l.shortId === shortListId))
			.find(l => !!l);
	},
};
