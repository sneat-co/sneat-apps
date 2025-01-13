import { IContactBrief, MemberGroupType } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';

export interface MembersGroup {
	readonly id: MemberGroupType;
	readonly role: string;
	readonly emoji: string;
	readonly plural: string;
	readonly addLabel: string;
	readonly members?: readonly IIdAndBrief<IContactBrief>[];
}
