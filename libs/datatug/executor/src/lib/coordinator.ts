import { Observable } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpExecutor } from './executors/http-executor';
import { IRequestExecutor } from './command-executor';
import { AgentService } from '@sneat/ext-datatug-services-repo';
import { IExecuteRequest, IExecuteResponse } from '@sneat/ext-datatug-dto';

@Injectable()
export class Coordinator {
	private readonly httpExecutor = inject(HttpExecutor);
	private readonly agentService = inject(AgentService);

	public execute(
		agentId: string,
		request: IExecuteRequest,
	): Observable<IExecuteResponse> {
		let executor: IRequestExecutor;
		if (request.commands.length === 1 && request.commands[0].type === 'HTTP') {
			executor = this.httpExecutor;
		} else {
			executor = this.agentService;
		}
		return executor.execute(agentId, request);
	}
}
