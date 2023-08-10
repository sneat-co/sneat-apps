import { IAvatar } from '@sneat/auth/models';
import { EnumAsUnionOfKeys, excludeUndefined } from '@sneat/core';
import { ITeamMemberInfo } from './dto-commune';
import { IPersonRecord, ITitledRecordInfo, ITotalsHolder, IVerification } from './dto-models';
import { IContactBrief } from './dto-contact';
import { DtoGroupTerms } from './dto-term';
import { MembersVisibility, TeamMemberType } from './types';

export const RoleTeamMember = 'team_member';
export const MemberRoleContributor = 'contributor';
export const MemberRoleSpectator = 'spectator';
export const MemberRoleParish = 'pastor';
export type MemberRoleEducation = 'administrator' | 'principal' | 'pupil' | 'teacher';
export type MemberRoleRealtor = 'administrator' | 'agent';

export type MemberRole =
	typeof MemberRoleContributor |
	typeof MemberRoleSpectator |
	MemberRoleEducation |
	MemberRoleRealtor |
	typeof MemberRoleParish;

export enum FamilyMemberRelation {
	child = 'child',
	parent = 'parent',
	grandparent = 'grandparent',
	sibling = 'sibling',
	cousin = 'cousin',
	spouse = 'spouse',
	partner = 'partner',
}


export function relationshipTitle(id: string): string {
	return id ? id[0].toUpperCase() + id.substr(1) : '';
}

export type FamilyMemberRelations = EnumAsUnionOfKeys<typeof FamilyMemberRelation>;

export const MemberRelationshipOther = 'other';
export const MemberRelationshipUndisclosed = 'undisclosed';

export type MemberRelationship =
	FamilyMemberRelations
	| typeof MemberRelationshipOther
	| typeof MemberRelationshipUndisclosed;

export interface IContactGroupBrief {
	title: string;
}

export interface IContactGroupDto extends IContactGroupBrief {
	// teamID: string; This is part of a key
	desc?: string;
	timetable?: string;
	membersVisibility: MembersVisibility;
	numberOf?: IContactGroupDtoCounts;
	terms?: DtoGroupTerms;
}

export interface IMemberBase extends IPersonRecord, IVerification, ITotalsHolder {
	readonly type: TeamMemberType;
	readonly title?: string;
	readonly userID?: string; // User ID
	readonly roles?: readonly MemberRole[];
	readonly avatar?: IAvatar;
}

export interface IMemberBrief extends IContactBrief {
}

export interface IMemberDto extends IMemberBase {
	position?: string;
	groups?: IContactGroupBrief[];
}

export interface IWithContactGroups {
	groupIDs?: readonly string[];
	groups: { [id: string]: IContactGroupBrief };
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

export function memberDtoFromMemberInfo(memberInfo: ITeamMemberInfo, teamId: string, title: string): IMemberDto {
	const memberType: TeamMemberType = 'member';
	return excludeUndefined({
		...memberInfo,
		teamId,
		title,
		type: memberType,
	});
}

export interface IContactGroupDtoCounts {
	members?: number;
}

// Deprecated
export interface ICommuneDtoMemberGroupInfo extends ITitledRecordInfo {
	members: number;
}

