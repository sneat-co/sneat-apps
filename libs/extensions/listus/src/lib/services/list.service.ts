import { HttpParams } from '@angular/common/http';
import { Injectable, inject, Injector } from '@angular/core';
import {
	Firestore as AngularFirestore,
	DocumentReference,
	collection,
	doc,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IListBrief, IListDbo, ListType } from '../dto';
import { IListContext } from '../contexts';
import { ISpaceContext } from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
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
export class ListService extends ModuleSpaceItemService<IListBrief, IListDbo> {
	constructor() {
		const afs = inject(AngularFirestore);
		const sneatApiService = inject(SneatApiService);
		const injector = inject(Injector);
		super(injector, 'listus', 'lists', afs, sneatApiService);
	}

	public createList(request: ICreateListRequest): Observable<IListContext> {
		return this.sneatApiService
			.post<IListContext>('lists/create_list', request)
			.pipe(
				map((list) => {
					if (!list.brief) {
						if (!list.dbo) {
							throw new Error('response does not have either brief or dto');
						}
						const title = list.dbo.title || list.id;
						list = { ...list, brief: { ...list.dbo, title } };
					}
					return list;
				}),
			);
	}

	public deleteList(space: ISpaceContext, listId: string): Observable<void> {
		if (space.type === 'family' && listId === 'groceries') {
			return throwError(
				() => 'groceries list is not removable for family team',
			);
		}
		return this.sneatApiService.delete(
			`lists/delete_list?space=${space.id}&id=${listId}`,
		);
	}

	public reorderListItems(request: IReorderListItemsRequest): Observable<void> {
		return this.sneatApiService.post(`listus/list_items_reorder?`, request);
	}

	private getFullListID(type: ListType, shortID: string): string {
		return `${type}:${shortID}`;
	}

	public createListItems(
		params: IListItemsCommandParams,
	): Observable<IListItemResult> {
		console.log('createListItems', params);
		if (!params.list.type) {
			return throwError(() => 'list is of unknown type: ' + params.list.type);
		}
		const request: ICreateListItemsRequest = {
			spaceID: params.space.id,
			listID: params.list.id,
			// listType: params.list.type,
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
					spaceID: request.spaceID,
					// listType: request.listType,
					listID: request.listID,
				},
			}),
			{ itemIDs: request.itemIDs },
		);
	}

	public getListById(
		space: ISpaceContext,
		listType: ListType,
		listID: string,
	): Observable<IListContext> {
		const id = this.getFullListID(listType, listID);
		const listDocRef = this.listDocRef(space.id, id);
		return this.sfs.getByDocRef(listDocRef).pipe(
			map((listContext) => {
				return this.onListSnapshot(space, listID, listType, listContext.dbo);
			}),
		);
	}

	private readonly onListSnapshot = (
		space: ISpaceContext,
		id: string,
		type: ListType,
		dbo?: IListDbo | null,
	): IListContext => ({
		id,
		type,
		dbo,
		brief: dbo,
		space,
	});

	private listDocRef(
		spaceID: string,
		listID: string,
	): DocumentReference<IListDbo> {
		const listsCollection = collection(
			this.afs,
			'spaces',
			spaceID,
			'ext',
			'listus',
			'lists',
		);
		return doc(listsCollection, listID) as DocumentReference<IListDbo>;
	}
}
