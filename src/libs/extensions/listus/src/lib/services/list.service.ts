import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { IListBrief, IListDto, ListType } from '@sneat/dto';
import { IListContext, ITeamContext } from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
	ICreateListRequest,
	IDeleteListItemsRequest,
	IListItemResult,
	IListItemsCommandParams,
	ReorderListItemsWorker,
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

	public reorderListItems(params: IListItemsCommandParams, reorderItems: ReorderListItemsWorker): Observable<IListContext> {
		return throwError(() => 'not implemented yet');
	}

	public watchListById(id: string): Observable<IListContext> {
		const doc = this.listDocRef(id);
		return doc.snapshotChanges()
			.pipe(
				map(snapshot => {
					const { exists, data } = snapshot.payload;
					let dto: IListDto | null = null;
					if (exists) {
						dto = data();
					}
					return this.onListSnapshot(id, exists, dto);
				}),
			);
	}


	public addListItem(params: IListItemsCommandParams): Observable<IListItemResult> {
		return throwError(() => 'not implemented yet');
	}

	public deleteListItem(request: IDeleteListItemsRequest): Observable<void> {
		return throwError(() => 'not implemented yet');
	}

	public getListById(id: string): Observable<IListContext | null> {
		return this.listDocRef(id).get().pipe(
			map(snapshot => {
				const { exists } = snapshot;
				return this.onListSnapshot(id, snapshot.exists, exists ? snapshot.data() || null : null);
			}),
		);
	}

	private readonly onListSnapshot = (id: string, exists: boolean, dto: IListDto | null): IListContext => {
		if (!exists) {
			return { id };
		}
		const brief: IListBrief = { id, type: undefined as unknown as ListType, ...dto, title: dto?.title || id };
		const list: IListContext = { id, dto, brief };
		return list;
	};

	private listDocRef(id: string): AngularFirestoreDocument<IListDto> {
		return this.db.collection('team_lists').doc(id);
	}
}

