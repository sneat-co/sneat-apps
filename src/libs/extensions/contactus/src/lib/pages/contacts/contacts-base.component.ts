import { IContactContext } from '@sneat/team/models';

export interface IContactGroup {
	id: string;
	title: string;
	roles: IContactRole[];
}

export interface IContactRole {
	id: string;
	title: string;
	emoji?: string;
	contacts?: IContactContext[];
	finder?: string;
}
