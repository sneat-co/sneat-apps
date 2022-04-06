import { Injectable, NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { CommuneType, IListBrief, ListType, TeamType } from '@sneat/dto';
import { IListContext, ITeamContext, ITeamRequest } from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export function shortCommuneAndListIds(id: string): { shortCommuneId?: TeamType; shortListId?: ListType } {
	const i = id.indexOf('-');
	if (i < 0) {
		return {};
	}
	return { shortCommuneId: id.substr(0, i) as CommuneType, shortListId: id.substr(i + 1) as ListType };
}

export interface ICreateListRequest extends ITeamRequest, IListBrief {
}

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
						list = { ...list, brief: { id: list.id, title: list.dto.title || list.id, ...list.dto } };
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
}

