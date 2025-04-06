import {
	IContactGroupBrief,
	IContactRoleWithIdAndBrief,
	IContactWithCheck,
} from '@sneat/contactus-core';

export interface IContactRoleWithContacts extends IContactRoleWithIdAndBrief {
	contacts: readonly IContactWithCheck[];
}

export interface IContactGroupWithContacts {
	readonly id: string;
	readonly brief: IContactGroupBrief;
	roles: IContactRoleWithContacts[];
}
