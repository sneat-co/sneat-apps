import { IDemoRecord, ITitledRecord, ITotalsHolder } from './dto-models';
import { CommuneType, CountryId } from './types';

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

// type TeamCounters = {
// 	[P in EnumAsUnionOfKeys<typeof TeamCounter>]: number;
// };

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

export function incrementNumberOf<
	NumberOf,
	Dbo extends { numberOf?: NumberOf },
>(dbo: Dbo, init: () => NumberOf, counter: keyof NumberOf, v = 1): Dbo {
	const current: number = ((dbo.numberOf && dbo.numberOf[counter]) ||
		0) as unknown as number;
	return {
		...dbo,
		numberOf: {
			...(dbo.numberOf || init()),
			[counter]: current + v,
		},
	};
}

export function newTeamCounts(numberOf?: TeamCounts): TeamCounts {
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

export interface ICommuneDbo extends IDemoRecord, ITitledRecord, ITotalsHolder {
	readonly countryId?: CountryId;
	readonly type: CommuneType;
	readonly desc?: string;
	readonly userID: string;
	readonly order?: number;
	readonly numberOf?: TeamCounts;
	readonly membersCountByRole?: Record<string, number>;
	readonly noContactRoles?: string[];
	// readonly groups?: ICommuneDtoMemberGroupInfo[];
	// readonly members?: readonly ITeamMemberInfo[];
}

export function isCommuneShouldHoldMembersInfo(type: CommuneType): boolean {
	return type === 'family' || type === 'cohabit';
}

// export function findCommuneMemberInfo(
// 	members: readonly ITeamMemberInfo[],
// 	member: { readonly id?: string; readonly userID?: string },
// ): ITeamMemberInfo | undefined {
// 	return (
// 		members &&
// 		members.find(
// 			(m) =>
// 				(m && !!m.id && m.id === member.id) ||
// 				(!!m.userID && m.userID === member.userID),
// 		)
// 	);
// }

export const personalCommuneIdPrefix = 'u_';

export function getUserPersonalCommuneID(userID?: string): string {
	if (!userID) {
		throw new Error('userID is required parameter');
	}
	return personalCommuneIdPrefix + userID;
}

export function isPersonalCommuneId(id: string): boolean {
	return !!id && id.startsWith(personalCommuneIdPrefix);
}

export function isUserPersonalCommune(
	communeID: string,
	userID?: string,
): boolean {
	return !!userID && communeID === getUserPersonalCommuneID(userID);
}

// export const CommuneModel = {
// 	getListInfoByRealId: (dto: ITeamDto, listId: string) => {
// 		const result =
// 			dto.listGroups &&
// 			dto.listGroups
// 				.map((lg) => lg.lists && lg.lists.find((l) => l.id === listId))
// 				.find((l) => !!l);
// 		console.log(
// 			`CommuneModel.getListInfoByRealId(${listId})`,
// 			dto.listGroups,
// 			' => ',
// 			result,
// 		);
// 		return result;
// 	},
//
// 	getListInfoByShortId: (dto: ICommuneDto, shortListId: string) => {
// 		console.log(
// 			`CommuneModel.getListInfoByShortId(${shortListId})`,
// 			dto.listGroups,
// 		);
// 		return (
// 			dto.listGroups &&
// 			dto.listGroups
// 				.map(
// 					(lg) => lg.lists && lg.lists.find((l) => l.shortId === shortListId),
// 				)
// 				.find((l) => !!l)
// 		);
// 	},
// };
