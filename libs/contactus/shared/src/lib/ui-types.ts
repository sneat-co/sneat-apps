import { IContactGroupBrief, IContactRoleBriefWithID } from '@sneat/dto';
import { IContactContext } from '@sneat/team/models';

export interface IContactRoleWithContacts extends IContactRoleBriefWithID {
	contacts?: IContactContext[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	id: string;
	roles: IContactRoleWithContacts[];
}
