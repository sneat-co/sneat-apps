import {ProjectItemService} from './project-item-service';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {QUERY_PROJ_ITEM_SERVICE} from './queries.service.token';
import {IQueryDef, IQueryFolder} from '@sneat/datatug/models';
import {IDatatugProjRef} from '@sneat/datatug/core';

@Injectable()
export class QueriesService {
	constructor(
		@Inject(QUERY_PROJ_ITEM_SERVICE) private readonly projItemService: ProjectItemService<IQueryDef>,
	) {
	}

	public getQueriesFolder(from: IDatatugProjRef, folderPath: string): Observable<IQueryFolder> {
		// const v: IQueryDef[] = [{id: 'id1', type: 'SQL', title: 'Query 1', text: 'select  * from table1'}];
		// return of(v);
		return this.projItemService.getFolder<IQueryFolder>(from, folderPath);
	}

	public getQuery(from: IDatatugProjRef, id: string): Observable<IQueryDef> {
		return this.projItemService.getProjItem(from, id);
	}

	public createFolder(target: IDatatugProjRef, name: string): Observable<IQueryDef> {
		const folder: IQueryFolder = {
			id: name,
		}
		return this.projItemService.createProjItem(target, folder as unknown as IQueryDef);
	}

	public createQuery(target: IDatatugProjRef, query: IQueryDef): Observable<IQueryDef> {
		return this.projItemService.createProjItem(target, query);
	}

	public updateQuery(target: IDatatugProjRef, query: IQueryDef): Observable<IQueryDef> {
		return this.projItemService.updateProjItem(target, query);
	}

	public deleteQuery(projId: string, query: IQueryDef): Observable<IQueryDef> {
		return this.projItemService.deleteProjItem(projId, query.id);
	}
}
