import { IAvatar } from '@sneat/auth-models';
import { EnumAsUnionOfKeys, excludeUndefined } from '@sneat/core';
import { ITeamMemberInfo } from './dto-commune';
import { IContact2Member } from './dto-contact2';
import { IPersonRecord, ITitledRecordInfo, ITotalsHolder, IVerification } from './dto-models';
import { DtoGroupTerms } from './dto-term';
import { AgeGroup, MembersVisibility, MemberType } from './types';

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

export interface IMemberGroupBase {
	title: string;
}

export interface IMemberGroupBrief extends IMemberGroupBase {
	id: string;
}

export interface IMemberGroupDto extends IMemberGroupBase {
	teamID: string;
	desc?: string;
	timetable?: string;
	membersVisibility: MembersVisibility;
	numberOf?: IMemberGroupDtoCounts;
	terms?: DtoGroupTerms;
}

export interface IMemberBase extends IPersonRecord, IVerification, ITotalsHolder {
	readonly title?: string;
	readonly groupIDs?: readonly string[];
	readonly userID?: string; // User ID
	readonly type?: MemberType;
	readonly roles?: readonly MemberRole[];
	readonly avatar?: IAvatar;
}

export interface IMemberBrief extends IMemberBase {
	id: string;
	shortTitle?: string;
}

export interface IMemberDto extends IMemberBase {
	position?: string;
	groups?: IMemberGroupBrief[];
	contacts?: IContact2Member[];
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

export function memberDtoFromMemberInfo(memberInfo: ITeamMemberInfo, communeId: string, title: string): IMemberDto {
	return excludeUndefined({
		...memberInfo,
		communeId,
		title,
		type: 'member',
	});
}

export interface IMemberGroupDtoCounts {
	members?: number;
}

export interface ICommuneDtoMemberGroupInfo extends ITitledRecordInfo {
	members: number;
}

