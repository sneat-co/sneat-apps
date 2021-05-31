import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpExecutor} from './executors/http-executor';
import {IRequestExecutor} from './command-executor';
import {AgentService} from '@sneat/datatug/services/repo';
import {IExecuteRequest, IExecuteResponse} from '@sneat/datatug/dto';

@Injectable({
	providedIn: 'root'
})
export class Coordinator {
	constructor(
		private readonly httpExecutor: HttpExecutor, // Load dynamically?
		private readonly agentService: AgentService,
	) {
	}

	public execute(repoId: string, request: IExecuteRequest): Observable<IExecuteResponse> {
		let executor: IRequestExecutor;
		if (request.commands.length === 1 && request.commands[0].type === 'HTTP') {
			executor = this.httpExecutor;
		} else {
			executor = this.agentService;
		}
		return executor.execute(repoId, request);
	}
}
