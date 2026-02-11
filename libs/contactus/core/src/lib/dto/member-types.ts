export type MembersVisibility = 'private' | 'protected' | 'public';
export const RoleSpaceMember = 'member';
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
