import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {IBoardDef, IProjBoard, IProjStoreRef} from '@sneat/datatug/models';
// import {StoreApiService} from '@sneat/datatug/services/repo';
import {IProjectRef} from '@sneat/datatug/core';
import {SneatApiServiceFactory} from '@sneat/api';
import {ICreateProjectItemRequest} from '@sneat/datatug/services/project';

@Injectable()
export class BoardService {

	constructor(
		// private readonly repoProviderService: StoreApiService,
		private readonly sneatApiServiceFactory: SneatApiServiceFactory,
	) {
	}

	getBoard(storeId: string, project: string, boardId: string): Observable<IBoardDef> {
		if (!storeId) {
			return throwError('required parameter "store" has not been provided');
		}
		if (!project) {
			return throwError('required parameter "project" has not been provided');
		}
		if (project === 'undefined') {
			return throwError('required parameter "project" has "undefined" string value');
		}
		if (!storeId) {
			return throwError('required parameter "boardId" has not been provided');
		}
		return throwError('not implemented');
		// return this.repoProviderService.get(storeId, '/boards/board', {params: {id: boardId, project}});
	}

	createNewBoard(storeRef: IProjStoreRef, projectRef: IProjectRef, title: string): Observable<IProjBoard> {
		console.log('BoardService.createNewBoard()', projectRef);
		const service = this.sneatApiServiceFactory.getSneatApiService(storeRef);
		return service.post<ICreateProjectItemRequest, { id: string }>(
			`/datatug/boards/create_board?project=${projectRef.projectId}&store=${projectRef.storeId}`,
			{title, folder: '~'}, {
				params: {project: projectRef.projectId}
			});
		// return this.repoProviderService.post<IProjBoard>(projectRef.storeId, '/datatug/boards/create_board', {title}, {params: {project: projectRef.projectId}});
	}
}
