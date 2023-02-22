import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { IListDto, ListType } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	ICreateListRequest,
	IDeleteListItemsRequest,
	IListItemResult,
	IListItemsCommandParams,
	IReorderListItemsRequest,
	ISetListItemsIsComplete,
} from './interfaces';

@Injectable()
export class ListService {

	constructor(
		private readonly db: AngularFirestore,
		private readonly sneatApiService: SneatApiService,
		// private readonly teamItemService: TeamItemBaseService,
		// private readonly teamService: TeamService,
	) {
	}

	public createList(request: ICreateListRequest): Observable<IListContext> {
		return this.sneatApiService
			.post<IListContext>('lists/create_list', request).pipe(
				map(list => {
					if (!list.brief) {
						if (!list.dto) {
							throw new Error('response does not have either brief or dto');
						}
						const title = list.dto.title || list.id;
						list = { ...list, brief: { ...list.dto, id: list.id, title } };
					}
					return list;
				}),
			);
	}

	public deleteList(team: ITeamContext, listId: string): Observable<void> {
		if (team.type === 'family' && listId === 'groceries') {
			return throwError(() => 'groceries list is not removable for family team');
		}
		return this.sneatApiService.delete(`lists/delete_list?team=${team.id}&id=${listId}`);
	}

	public reorderListItems(request: IReorderListItemsRequest): Observable<void> {
		return this.sneatApiService.post(`listus/list_items_reorder?`, request);
	}

	getFullListID(type: ListType, shortID: string): string {
		return `${type}:${shortID}`;
	}

	public watchList(team: ITeamContext, listType: ListType, listID: string): Observable<IListContext> {
		const id = this.getFullListID(listType, listID);
		const doc = this.listDocRef(team.id, id);
		return doc.snapshotChanges()
			.pipe(
				map(snapshot => {
					console.log(`watchListById(${id}) => snapshot:`, snapshot);
					let dto: IListDto | null = null;
					if (snapshot.payload.exists) {
						dto = snapshot.payload.data();
					}
					// console.log(`watchListById(id) =>`, snapshot.payload.exists, dto, snapshot);
					return this.onListSnapshot(team, listID, listType, dto);
				}),
			);
	}


	public createListItems(params: IListItemsCommandParams): Observable<IListItemResult> {
		console.log('createListItems', params);
		const listType: ListType | undefined =
			params.list?.brief?.type || params.list?.dto?.type || (params.list.id === 'groceries' ? 'to-buy' : undefined);
		if (!listType) {
			return throwError(() => 'list is of unknown type');
		}
		const request = {
			teamID: params.team.id,
			listID: params.list.id,
			listType,
			items: params.items,
		};
		return this.sneatApiService.post('listus/list_items_create', request);
	}

	public setListItemsIsCompleted(request: ISetListItemsIsComplete): Observable<void> {
		const url = 'listus/list_items_set_is_done';
		return this.sneatApiService.post(url, request);
	}

	public deleteListItems(request: IDeleteListItemsRequest): Observable<void> {
		return this.sneatApiService.delete(
			`listus/list_items_delete?`, new HttpParams({
				fromObject: {
					teamID: request.teamID,
					listType: request.listType,
					listID: request.listID,
				},
			}), { itemIDs: request.itemIDs });
	}

	public getListById(team: ITeamContext, listType: ListType, listID: string): Observable<IListContext | null> {
		const id = this.getFullListID(listType, listID);
		return this.listDocRef(team.id, id).get().pipe(
			map(snapshot => {
				const { exists } = snapshot;
				return this.onListSnapshot(team, listID, listType, exists ? snapshot.data() || null : null);
			}),
		);
	}


	private readonly onListSnapshot = (team: ITeamContext, id: string, type: ListType, dto: IListDto | null): IListContext => ({
		id, dto,
		brief: dto === null ? null : { ...dto, id, type },
		team,
	});

	private listDocRef(teamID: string, listID: string): AngularFirestoreDocument<IListDto> {
		return this.db.collection('teams').doc(teamID).collection('lists').doc(listID);
	}
}

