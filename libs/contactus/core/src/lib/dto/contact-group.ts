import { IContactRoleBriefWithID } from './contact-roles';
import { DtoGroupTerms } from './term';
import { MembersVisibility } from './member';

export interface IContactGroupBrief {
	readonly emoji?: string;
	readonly title: string;
}

export interface IContactGroupDtoCounts {
	members?: number;
}

export interface IContactGroupDbo extends IContactGroupBrief {
	// teamID: string; This is part of a key
	readonly desc?: string;
	readonly timetable?: string;
	readonly membersVisibility?: MembersVisibility;
	readonly numberOf?: IContactGroupDtoCounts;
	readonly terms?: DtoGroupTerms;
	readonly roles?: readonly IContactRoleBriefWithID[];
}
