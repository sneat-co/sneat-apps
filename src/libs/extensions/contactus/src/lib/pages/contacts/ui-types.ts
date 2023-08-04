import { IContactContext } from '@sneat/team/models';
import { IContactGroupBrief, IContactRoleBrief } from '../../../../../../team/contacts/services/src/lib';

export interface IContactRoleWithContacts extends IContactRoleBrief {
	contacts?: IContactContext[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	roles: IContactRoleWithContacts[];
}
