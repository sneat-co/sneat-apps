import { IContactGroupBrief } from './contact-group-brief';
import { IContactRoleWithIdAndBrief } from './contact-roles';

import { MembersVisibility } from './member-types';
import { DtoGroupTerms } from './term';

export interface IContactGroupDtoCounts {
  members?: number;
}

export interface IContactGroupDbo extends IContactGroupBrief {
  // spaceID: string; This is part of a key
  readonly desc?: string;
  readonly timetable?: string;
  readonly membersVisibility?: MembersVisibility;
  readonly numberOf?: IContactGroupDtoCounts;
  readonly terms?: DtoGroupTerms;
  readonly roles?: readonly IContactRoleWithIdAndBrief[];
}
