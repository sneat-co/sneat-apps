import { IAvatar, SpaceMemberType } from '@sneat/auth-models';
import { EnumAsUnionOfKeys, excludeUndefined } from '@sneat/core';
import { ITitledRecordInfo, ITotalsHolder, IVerification } from '@sneat/dto';
import { IContactBrief } from './contact';
import { IContactGroupBrief } from './contact-group-brief';
import { FamilyMemberRelation, MemberRole } from './member-types';
import { IPersonRecord, ISpaceMemberInfo } from './person';

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
  extends IPersonRecord, IVerification, ITotalsHolder {
  readonly type: SpaceMemberType;
  readonly title?: string;
  readonly userID?: string; // User ID
  readonly roles?: readonly MemberRole[];
  readonly avatar?: IAvatar;
}

export type IMemberBrief = IContactBrief;

export interface IMemberDbo extends IMemberBase {
  position?: string;
  groups?: IContactGroupBrief[];
}

export interface IWithContactGroups {
  groupIDs?: readonly string[];
  groups: Record<string, IContactGroupBrief>;
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
  memberInfo: ISpaceMemberInfo,
  spaceID: string,
  title: string,
): IMemberDbo {
  const memberType: SpaceMemberType = 'member';
  return excludeUndefined({
    ...memberInfo,
    spaceID,
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
