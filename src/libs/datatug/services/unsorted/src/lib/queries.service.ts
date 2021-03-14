import {ProjectItemService} from './project-item-service';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {QUERY_PROJ_ITEM_SERVICE} from './queries.service.token';
import {IQueryDef, QueryItem} from '@sneat/datatug/models';
import {IDatatugProjRef} from '@sneat/datatug/core';

@Injectable()
// @ts-ignore // TODO: why it's complaining about TS1219?
export class QueriesService {
	constructor(
		// @ts-ignore // TODO: why it's complaining about TS1219?
		@Inject(QUERY_PROJ_ITEM_SERVICE) private readonly projItemService: ProjectItemService,
	) {
	}

	public getQueries(from: IDatatugProjRef, folder: string): Observable<QueryItem[]> {
		// const v: IQueryDef[] = [{id: 'id1', type: 'SQL', title: 'Query 1', text: 'select  * from table1'}];
		// return of(v);
		return this.projItemService.getProjItems(from, folder);
	}

	public getQuery(from: IDatatugProjRef, id: string): Observable<IQueryDef> {
		return this.projItemService.getProjItem(from, id);
	}

	public createQuery(projId: string, query: IQueryDef): Observable<IQueryDef> {
		return this.projItemService.createProjItem(projId, query);
	}

	public updateQuery(projId: string, query: IQueryDef): Observable<IQueryDef> {
		return this.projItemService.updateProjItem(projId, query);
	}

	public deleteQuery(projId: string, query: IQueryDef): Observable<IQueryDef> {
		return this.projItemService.deleteProjItem(projId, query);
	}
}
