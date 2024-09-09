import { ICommuneDbo } from '@sneat/dto';
import {
	IListBrief,
	IListDbo,
	IListItemBase,
	IListItemBrief,
	IListItemDbo,
} from '../dto';
import { IListContext } from '../contexts';
import { ISpaceContext, SpaceRequest } from '@sneat/team-models';

export interface GetOrCreateCommuneItemIds {
	id?: string;
	shortId?: string;
	communeShortId?: string;
}

// export abstract class IListService extends ICommuneItemService<IListDto, ListusAppSchema, typeof ListKind> {
// 	abstract deleteList(listId: string, communeId: string): Observable<IListDto>;
// }
//
// export abstract class IListItemService extends ICommuneItemService<IListItemDto, ListusAppSchema, typeof ListItemKind> {
// 	// noinspection JSUnusedGlobalSymbols
// 	// abstract txRemoveKinds(): string[];
//
// 	// noinspection JSUnusedGlobalSymbols
// 	abstract selectByListId(tx: IRxReadonlyTransaction<ListusAppSchema>, listId: string, status?: ListStatus)
// 		: Observable<SelectResult<IListItemDto>>;
// }

export interface IProgress {
	current: number;
	total: number;
	state?: string;
}

export interface IListItemResult {
	message?: string;
	changed?: boolean;
	success: boolean;
	listDto: IListDbo;
	communeDto?: ICommuneDbo;
	listItemDto?: IListItemDbo;
}

export interface IListItemsCommandParams {
	space: ISpaceContext;
	list: IListContext;
	items: IListItemBrief[];
}

export type ReorderListItemsWorker = (listDto: IListDbo) => void;

// export abstract class IListusService extends RxStoreService<ListusAppSchema> {
// 	abstract addListItem(params: IListItemCommandParams): Observable<IListItemResult>;
//
// 	abstract reorderListItems(params: IListItemCommandParams, reorderItems: ReorderListItemsWorker): Observable<IListDto>;
//
// 	abstract deleteListItem(params: IListItemCommandParams): Observable<IListDto>;
//
// 	// TODO: Should not be part of general list
// 	abstract isWatched(movie: IMovie, userId: string): boolean;
//
// 	abstract setIsWatched(movie: IMovie, userId: string, isWatched: boolean): Observable<IMovieDto>;
//
// 	abstract copyListItems(
// 		fromListId: string, toListId: string,
// 		listItems: IListItemInfo[],
// 		userDto: IUserDto,
// 	): Observable<void>;
//
// }

// export const TMDB_PROVIDER = new InjectionToken<ITmdbService>('tmdbService');

// export function shortCommuneAndListIds(id: string): { shortCommuneId?: SpaceType; shortListId?: ListType } {
// 	const i = id.indexOf('-');
// 	if (i < 0) {
// 		return {};
// 	}
// 	return { shortCommuneId: id.substr(0, i) as CommuneType, shortListId: id.substr(i + 1) as ListType };
// }

export interface ICreateListRequest extends SpaceRequest, IListBrief {}

export interface IListRequest extends SpaceRequest {
	readonly listID: string;
	// readonly listType: ListType;
}

export interface ICreateListItemRequest extends IListItemBase {
	id: string;
}

export interface ICreateListItemsRequest extends IListRequest {
	items: ICreateListItemRequest[];
}

export interface IListItemRequest extends IListRequest {
	itemID: string;
}

export interface IListItemIDsRequest extends IListRequest {
	readonly itemIDs: string[];
}

export interface IReorderListItemsRequest extends IListItemIDsRequest {
	toIndex: number;
}

export type IDeleteListItemsRequest = IListItemIDsRequest;

export interface ISetListItemsIsComplete extends IListItemIDsRequest {
	isDone: boolean;
}
