import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {IBoardDef, IProjBoard} from '@sneat/datatug/models';
import {StoreApiService} from '@sneat/datatug/services/repo';
import {IProjectRef} from '@sneat/datatug/core';

@Injectable()
export class BoardService {

	constructor(
		private readonly repoProviderService: StoreApiService,
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
		return this.repoProviderService.get(storeId, '/boards/board', {params: {id: boardId, project}});
	}

	createNewBoard(projectRef: IProjectRef, title: string): Observable<IProjBoard> {
		console.log('BoardService.createNewBoard()', projectRef);
		return this.repoProviderService.post<IProjBoard>(projectRef.storeId, '/boards/create_board', {title}, {params: {project: projectRef.projectId}});
	}
}
