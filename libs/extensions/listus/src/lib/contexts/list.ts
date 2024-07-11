import { ISpaceItemNavContext } from '@sneat/team-models';
import { IListBrief, IListDbo, ListType } from '../dto';

export interface IListKey {
	id: string;
	type: ListType;
}

export interface IListContext
	extends ISpaceItemNavContext<IListBrief, IListDbo> {
	type: ListType;
}
