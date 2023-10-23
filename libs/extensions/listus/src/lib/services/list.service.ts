import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	Firestore as AngularFirestore,
	DocumentReference,
	collection,
	doc,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IListBrief, IListDto, ListType } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team-models';
import { TeamItemService } from '@sneat/team-services';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	ICreateListItemsRequest,
	ICreateListRequest,
	IDeleteListItemsRequest,
	IListItemResult,
	IListItemsCommandParams,
	IReorderListItemsRequest,
	ISetListItemsIsComplete,
} from './interfaces';

@Injectable()
export class ListService extends TeamItemService<IListBrief, IListDto> {
	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
		// private readonly teamItemService: TeamItemBaseService,
		// private readonly teamService: TeamService,
	) {
		super('listus', 'lists', afs, sneatApiService);
	}

	public createList(request: ICreateListRequest): Observable<IListContext> {
		return this.sneatApiService
			.post<IListContext>('lists/create_list', request)
			.pipe(
				map((list) => {
					if (!list.brief) {
						if (!list.dto) {
							throw new Error('response does not have either brief or dto');
						}
						const title = list.dto.title || list.id;
						list = { ...list, brief: { ...list.dto, title } };
					}
					return list;
				}),
			);
	}

	public deleteList(team: ITeamContext, listId: string): Observable<void> {
		if (team.type === 'family' && listId === 'groceries') {
			return throwError(
				() => 'groceries list is not removable for family team',
			);
		}
		return this.sneatApiService.delete(
			`lists/delete_list?team=${team.id}&id=${listId}`,
		);
	}

	public reorderListItems(request: IReorderListItemsRequest): Observable<void> {
		return this.sneatApiService.post(`listus/list_items_reorder?`, request);
	}

	getFullListID(type: ListType, shortID: string): string {
		return `${type}:${shortID}`;
	}

	public watchList(
		team: ITeamContext,
		listType: ListType,
		listID: string,
	): Observable<IListContext> {
		console.log('watchList', team, listType, listID);
		const id = this.getFullListID(listType, listID);
		const doc = this.listDocRef(team.id, id);
		return this.sfs
			.watchByDocRef(doc)
			.pipe(
				map((listContext) =>
					this.onListSnapshot(team, listID, listType, listContext.dto),
				),
			);
	}

	public createListItems(
		params: IListItemsCommandParams,
	): Observable<IListItemResult> {
		console.log('createListItems', params);
		const listType: ListType | undefined =
			params.list?.brief?.type ||
			params.list?.dto?.type ||
			(params.list.id === 'groceries' ? 'to-buy' : undefined);
		if (!listType) {
			return throwError(() => 'list is of unknown type');
		}
		const request: ICreateListItemsRequest = {
			teamID: params.team.id,
			listID: params.list.id,
			listType,
			items: params.items,
		};
		return this.sneatApiService.post('listus/list_items_create', request);
	}

	public setListItemsIsCompleted(
		request: ISetListItemsIsComplete,
	): Observable<void> {
		const url = 'listus/list_items_set_is_done';
		return this.sneatApiService.post(url, request);
	}

	public deleteListItems(request: IDeleteListItemsRequest): Observable<void> {
		return this.sneatApiService.delete(
			`listus/list_items_delete?`,
			new HttpParams({
				fromObject: {
					teamID: request.teamID,
					listType: request.listType,
					listID: request.listID,
				},
			}),
			{ itemIDs: request.itemIDs },
		);
	}

	public getListById(
		team: ITeamContext,
		listType: ListType,
		listID: string,
	): Observable<IListContext> {
		const id = this.getFullListID(listType, listID);
		const listDocRef = this.listDocRef(team.id, id);
		return this.sfs.getByDocRef(listDocRef).pipe(
			map((listContext) => {
				return this.onListSnapshot(team, listID, listType, listContext.dto);
			}),
		);
	}

	private readonly onListSnapshot = (
		team: ITeamContext,
		id: string,
		type: ListType,
		dto?: IListDto | null,
	): IListContext => ({
		id,
		dto,
		brief: dto,
		team,
	});

	private listDocRef(
		teamID: string,
		listID: string,
	): DocumentReference<IListDto> {
		const listsCollection = collection(
			this.afs,
			'teams',
			teamID,
			'modules',
			'listus',
			'lists',
		);
		return doc(listsCollection, listID) as DocumentReference<IListDto>;
	}
}
