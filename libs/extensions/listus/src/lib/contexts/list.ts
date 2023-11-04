import { ITeamItemNavContext } from '@sneat/team-models';
import { IListBrief, IListDto, ListType } from '../dto';

export interface IListKey {
	id: string;
	type: ListType;
}

export interface IListContext
	extends ITeamItemNavContext<IListBrief, IListDto> {
	type?: ListType;
}
