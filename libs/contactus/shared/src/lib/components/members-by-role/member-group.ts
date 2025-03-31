import { IContactWithSpace, MemberGroupType } from '@sneat/contactus-core';

export interface MemberGroup {
	readonly id: MemberGroupType;
	readonly role: string;
	readonly emoji: string;
	readonly plural: string;
	readonly addLabel: string;
	readonly contacts?: readonly IContactWithSpace[];
}
