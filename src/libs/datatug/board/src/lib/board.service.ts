import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {IBoardDef, IProjBoard} from '@sneat/datatug/models';
import {RepoProviderService} from '@sneat/datatug/services/repo';

@Injectable()
export class BoardService {

	constructor(
		private readonly repoProviderService: RepoProviderService,
	) {
	}

	getBoard(repoId: string, project: string, boardId: string): Observable<IBoardDef> {
		if (!repoId) {
			return throwError('required parameter "repo" has not been provided');
		}
		if (!project) {
			return throwError('required parameter "project" has not been provided');
		}
		if (project === 'undefined') {
			return throwError('required parameter "project" has "undefined" string value');
		}
		if (!repoId) {
			return throwError('required parameter "boardId" has not been provided');
		}
		return this.repoProviderService.get(repoId, '/boards/board', {params: {id: boardId, project}});
	}

	createNewBoard(repoId: string, project: string, title: string): Observable<IProjBoard> {
		console.log('BoardService.createNewBoard()', repoId, project);
		return this.repoProviderService.post<IProjBoard>(repoId, '/boards/create_board', {title}, {params: {project}});
	}
}
