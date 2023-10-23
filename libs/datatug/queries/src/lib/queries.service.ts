import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QUERY_PROJ_ITEM_SERVICE } from './queries.service.token';
import { IQueryDef, IQueryFolder } from '@sneat/datatug-models';
import { IProjectRef } from '@sneat/datatug-core';
import { ProjectItemService } from '@sneat/datatug-services-repo';

@Injectable()
export class QueriesService {
	constructor(
		@Inject(QUERY_PROJ_ITEM_SERVICE)
		private readonly projItemService: ProjectItemService<IQueryDef>,
	) {}

	public getQueriesFolder(
		projRef: IProjectRef,
		folderPath: string,
	): Observable<IQueryFolder | null | undefined> {
		// const v: IQueryDef[] = [{id: 'id1', type: 'SQL', title: 'Query 1', text: 'select  * from table1'}];
		// return of(v);
		return this.projItemService.getFolder<IQueryFolder>(projRef, folderPath);
	}

	public getQuery(projRef: IProjectRef, id: string): Observable<IQueryDef> {
		return this.projItemService.getProjItem(projRef, id);
	}

	public createQueryFolder(
		projRef: IProjectRef,
		path: string,
		id: string,
	): Observable<IQueryFolder> {
		return this.projItemService.createProjItem(
			projRef,
			{
				path,
				id,
			} as unknown as IQueryDef,
			'folder',
		) as unknown as Observable<IQueryFolder>;
	}

	public createQuery(
		projRef: IProjectRef,
		query: IQueryDef,
	): Observable<IQueryDef> {
		return this.projItemService.createProjItem(projRef, query);
	}

	public updateQuery(
		projRef: IProjectRef,
		query: IQueryDef,
	): Observable<IQueryDef> {
		return this.projItemService.updateProjItem(projRef, query);
	}

	public deleteQuery(
		projRef: IProjectRef,
		folder: string,
		query: IQueryDef,
	): Observable<void> {
		return this.projItemService.deleteProjItem(
			projRef,
			folder ? folder + '/' + query.id : query.id,
		);
	}

	public deleteQueryFolder(
		projRef: IProjectRef,
		path: string,
	): Observable<void> {
		return this.projItemService.deleteProjItem(projRef, path, 'folder');
	}
}
