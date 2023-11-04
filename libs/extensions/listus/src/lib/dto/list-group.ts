import { IListInfo, ListType } from './list';

export interface IListGroup {
	id: string;
	title?: string;
	type?: ListType;
	emoji?: string;
	lists?: IListInfo[];
}
