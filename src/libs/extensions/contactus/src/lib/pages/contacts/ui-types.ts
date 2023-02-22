import { IContactContext } from '@sneat/team/models';
import { IContactGroupBrief, IContactRoleBrief } from '../../services';

export interface IContactRoleWithContacts extends IContactRoleBrief {
	contacts?: IContactContext[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	roles: IContactRoleWithContacts[];
}
