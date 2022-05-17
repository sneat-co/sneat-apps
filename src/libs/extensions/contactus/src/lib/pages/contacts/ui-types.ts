import { IContactContext } from '@sneat/team/models';
import { IContactGroup, IContactGroupBrief, IContactRoleBrief } from '../../contact-group.service';

export interface IContactRoleWithContacts extends IContactRoleBrief {
	contacts?: IContactContext[];
}

export interface IContactGroupWithContacts extends IContactGroupBrief {
	roles: IContactRoleWithContacts[];
}
