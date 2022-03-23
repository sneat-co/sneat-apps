import { MembersVisibility, MemberType } from '../types';
import { IContact2Member } from './dto-contact';
import { ICommuneRecord, IPersonRecord, ITitledRecordInfo, ITotalsHolder, IVerification } from './dto-models';
import { DtoGroupTerms } from './dto-term';
// import {RxRecordKey} from 'rxstore';
import { ICommuneMemberInfo } from './dto-commune';
import { EnumAsUnionOfKeys, excludeUndefined } from '@sneat/core';
import { RxRecordKey } from '@sneat/rxstore';

export type MemberRoleParish = 'pastor';
export type MemberRoleEducation = 'administrator' | 'principal' | 'pupil' | 'teacher';
export type MemberRoleRealtor = 'administrator' | 'agent';
export type MemberRole = MemberRoleEducation | MemberRoleRealtor | MemberRoleParish;

export const enum FamilyMemberRelation {
	child = 'child',
	parent = 'parent',
	grandparent = 'grandparent',
	sibling = 'sibling',
	spouse = 'spouse',
	partner = 'partner',
}

export function familyRelationTitle(id: FamilyMemberRelation): string {
	const s = (id as string);
	return s ? s[0].toUpperCase() + s.substr(1) : '';
}

export type FamilyMemberRelations = EnumAsUnionOfKeys<typeof FamilyMemberRelation>;

export const MemberRelationshipOther = 'other';
export const MemberRelationshipUndisclosed = 'undisclosed';

export type MemberRelationship =
	FamilyMemberRelations
	| typeof MemberRelationshipOther
	| typeof MemberRelationshipUndisclosed;

export interface DtoMemberGroupInfo {
	id: RxRecordKey;
	title: string;
}

export interface IMemberDto extends IPersonRecord, IVerification, ITotalsHolder {
	id?: RxRecordKey;
	title: string;
	type?: MemberType;
	position?: string;
	readonly roles?: readonly MemberRole[];
	readonly groupIds?: readonly string[]; // RxRecordKey[];
	groups?: DtoMemberGroupInfo[];
	contacts?: IContact2Member[];
}

export function newCommuneMemberInfo(m: IMemberDto): ICommuneMemberInfo {
	return excludeUndefined({
		id: m.id as string,
		userId: m.userId,
		title: m.title && m.userId && m.title === m.userId ? undefined : m.title,
		age: m.age,
		roles: m.roles,
		gender: m.gender,
		groupIds: m.groupIds,
	});
}

export function memberDtoFromMemberInfo(memberInfo: ICommuneMemberInfo, communeId: string, title: string): IMemberDto {
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

export interface IMemberGroupDto extends ICommuneRecord {
	communeId?: string; // RxRecordKey; // family commune ID
	title: string;
	desc?: string;
	timetable?: string;
	membersVisibility: MembersVisibility;
	numberOf?: IMemberGroupDtoCounts;
	terms?: DtoGroupTerms;
}
