//
import { ICommuneDto, IListBrief, IListDto, IListItemBrief, IListItemDto, ListType } from '@sneat/dto';
import { IListContext, ITeamContext, ITeamRequest } from '@sneat/team/models';

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
  listDto: IListDto;
  communeDto?: ICommuneDto;
  listItemDto?: IListItemDto;
}


export interface IListItemsCommandParams {
  team: ITeamContext;
  list: IListContext;
  items: IListItemBrief[];
}

export type ReorderListItemsWorker = (listDto: IListDto) => void;

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

// export function shortCommuneAndListIds(id: string): { shortCommuneId?: TeamType; shortListId?: ListType } {
// 	const i = id.indexOf('-');
// 	if (i < 0) {
// 		return {};
// 	}
// 	return { shortCommuneId: id.substr(0, i) as CommuneType, shortListId: id.substr(i + 1) as ListType };
// }

export interface ICreateListRequest extends ITeamRequest, IListBrief {
}

export interface IListRequest extends ITeamRequest {
  listID: string;
  listType: ListType;
}

export interface IListItemRequest extends IListRequest {
  itemID: string;
}

export interface IListItemIDsRequest extends IListRequest {
  itemIDs: string[];
}

export type IDeleteListItemsRequest = IListItemIDsRequest;
