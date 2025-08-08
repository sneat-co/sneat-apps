import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProjectRef } from '../core/project-context';
import { IQueryDef, IQueryFolder } from '../models/definition/query-def';
import { ProjectItemService } from '../services/repo/project-item-service';
import { QUERY_PROJ_ITEM_SERVICE } from './queries.service.token';

@Injectable()
export class QueriesService {
	private readonly projItemService = inject<ProjectItemService<IQueryDef>>(
		QUERY_PROJ_ITEM_SERVICE,
	);

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
