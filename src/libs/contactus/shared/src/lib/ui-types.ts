import { IContactGroupBrief } from '@sneat/dto';
import { IContactRoleBrief } from '@sneat/team/contacts/services';
import { IContactContext } from '@sneat/team/models';

export interface IContactRoleWithContacts extends IContactRoleBrief {
	contacts?: IContactContext[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	id: string;
	roles: IContactRoleWithContacts[];
}
