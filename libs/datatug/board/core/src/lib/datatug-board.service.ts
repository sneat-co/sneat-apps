import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IBoardDef, IProjBoard } from '@sneat/datatug-models';
// import {StoreApiService} from '@sneat/datatug-services-repo';
import { SneatApiServiceFactory } from '@sneat/api';
import { ICreateProjectItemRequest } from '@sneat/datatug-services-project';
import { CreateNamedRequest } from '@sneat/datatug-dto';

@Injectable()
export class DatatugBoardService {
	constructor(
		// private readonly repoProviderService: StoreApiService,
		private readonly sneatApiServiceFactory: SneatApiServiceFactory,
	) {}

	getBoard(
		storeId: string,
		project: string,
		boardId: string,
	): Observable<IBoardDef> {
		if (!boardId) {
			return throwError(
				() => 'required parameter "boardId" has not been provided',
			);
		}
		if (!storeId) {
			return throwError(
				() => 'required parameter "store" has not been provided',
			);
		}
		if (!project) {
			return throwError(
				() => 'required parameter "project" has not been provided',
			);
		}
		if (project === 'undefined') {
			return throwError(
				() => 'required parameter "project" has "undefined" string value',
			);
		}
		if (!storeId) {
			return throwError(
				() => 'required parameter "boardId" has not been provided',
			);
		}
		return throwError(() => `not implemented ${project} ${storeId} ${boardId}`);
		// return this.repoProviderService.get(storeId, '/boards/board', {params: {id: boardId, project}});
	}

	createNewBoard(request: CreateNamedRequest): Observable<IProjBoard> {
		console.log('BoardService.createNewBoard()', request);
		const { projectRef } = request;
		const service = this.sneatApiServiceFactory.getSneatApiService(
			projectRef.storeId,
		);
		return service.post<ICreateProjectItemRequest, { id: string }>(
			`/datatug/boards/create_board?project=${projectRef.projectId}&store=${projectRef.storeId}`,
			{ title: request.name, folder: '~' },
			{
				params: { project: projectRef.projectId },
			},
		);
		// return this.repoProviderService.post<IProjBoard>(projectRef.storeId, '/datatug/boards/create_board', {title}, {params: {project: projectRef.projectId}});
	}
}
