import {
	IContactBrief,
	IContactGroupBrief,
	IContactRoleBriefWithID,
} from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';

export interface IContactRoleWithContacts extends IContactRoleBriefWithID {
	contacts?: IIdAndBrief<IContactBrief>[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	id: string;
	roles: IContactRoleWithContacts[];
}
