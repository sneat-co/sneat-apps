import {
	IContactGroupBrief,
	IContactRoleBriefWithID,
	IContactWithCheck,
} from '@sneat/contactus-core';

export interface IContactRoleWithContacts extends IContactRoleBriefWithID {
	contacts: readonly IContactWithCheck[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	id: string;
	roles: IContactRoleWithContacts[];
}
