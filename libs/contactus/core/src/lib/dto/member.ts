import { IAvatar, TeamMemberType } from '@sneat/auth-models';
import { EnumAsUnionOfKeys, excludeUndefined } from '@sneat/core';
import { IContactGroupBrief } from './contact-group';
import { ITitledRecordInfo, ITotalsHolder, IVerification } from '@sneat/dto';
import { IContactBrief } from './contact';
import { IPersonRecord, ITeamMemberInfo } from './person';

export type MembersVisibility = 'private' | 'protected' | 'public';

export const RoleTeamMember = 'member';
export const MemberRoleContributor = 'contributor';
export const MemberRoleSpectator = 'spectator';
export const MemberRoleParish = 'pastor';
export type MemberRoleEducation =
	| 'administrator'
	| 'principal'
	| 'pupil'
	| 'teacher';
export type MemberRoleRealtor = 'administrator' | 'agent';

export type MemberRole =
	| typeof MemberRoleContributor
	| typeof MemberRoleSpectator
	| MemberRoleEducation
	| MemberRoleRealtor
	| typeof MemberRoleParish;

export enum FamilyMemberRelation {
	child = 'child',
	cousin = 'cousin',
	grandparent = 'grandparent',
	grandparentInLaw = 'grandparent_in_law',
	parent = 'parent',
	parentInLaw = 'parent_in_law',
	partner = 'partner',
	sibling = 'sibling',
	spouse = 'spouse',
}

export function relationshipTitle(id: string): string {
	// TODO: Needs fix to replace all _ with space
	return id ? id[0].toUpperCase() + id.substring(1).replace(/_+/g, ' ') : '';
}

export type FamilyMemberRelations = EnumAsUnionOfKeys<
	typeof FamilyMemberRelation
>;

export const MemberRelationshipOther = 'other';
export const MemberRelationshipUndisclosed = 'undisclosed';

export type MemberRelationship =
	| FamilyMemberRelations
	| typeof MemberRelationshipOther
	| typeof MemberRelationshipUndisclosed;

export interface IMemberBase
	extends IPersonRecord,
		IVerification,
		ITotalsHolder {
	readonly type: TeamMemberType;
	readonly title?: string;
	readonly userID?: string; // User ID
	readonly roles?: readonly MemberRole[];
	readonly avatar?: IAvatar;
}

export interface IMemberBrief extends IContactBrief {}

export interface IMemberDto extends IMemberBase {
	position?: string;
	groups?: IContactGroupBrief[];
}

export interface IWithContactGroups {
	groupIDs?: readonly string[];
	groups: {
		[id: string]: IContactGroupBrief;
	};
}

// export function newCommuneMemberInfo(id: string, m: IMemberDto): ITeamMemberInfo {
// 	return excludeUndefined({
// 		id: id,
// 		userID: m.uid,
// 		title: m.title && m.uid && m.title === m.uid ? undefined : m.title,
// 		ageGroup: m.ageGroup,
// 		roles: m.roles,
// 		gender: m.gender,
// 		groupIds: m.groupIDs,
// 	});
// }

export function memberDtoFromMemberInfo(
	memberInfo: ITeamMemberInfo,
	teamId: string,
	title: string,
): IMemberDto {
	const memberType: TeamMemberType = 'member';
	return excludeUndefined({
		...memberInfo,
		teamId,
		title,
		type: memberType,
	});
}

// Deprecated
export interface ICommuneDtoMemberGroupInfo extends ITitledRecordInfo {
	members: number;
}

export const MemberGroupTypeAdults = 'adults';
export const MemberGroupTypeKids = 'kids';
export const MemberGroupTypePets = 'pets';
export const MemberGroupTypeOther = 'other';

export type MemberGroupType =
	| typeof MemberGroupTypeAdults
	| typeof MemberGroupTypeKids
	| typeof MemberGroupTypePets
	| typeof MemberGroupTypeOther;
