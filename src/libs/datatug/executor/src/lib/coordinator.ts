import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpExecutor} from './executors/http-executor';
import {IRequestExecutor} from './command-executor';
import {RepoService} from '@sneat/datatug/services/repo';
import {IExecuteRequest} from '@sneat/datatug/models';
import {IExecuteResponse} from '@sneat/datatug/dto';

@Injectable({
	providedIn: 'root'
})
// @ts-ignore
export class Coordinator {
	constructor(
		private readonly httpExecutor: HttpExecutor, // Load dynamically?
		private readonly repoService: RepoService,
	) {
	}

	public execute(repoId: string, request: IExecuteRequest): Observable<IExecuteResponse> {
		let executor: IRequestExecutor;
		if (request.commands.length === 1 && request.commands[0].type === 'HTTP') {
			executor = this.httpExecutor;
		} else {
			executor = this.repoService;
		}
		return executor.execute(repoId, request);
	}
}
