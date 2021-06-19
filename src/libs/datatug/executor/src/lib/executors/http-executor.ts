import {ICommandExecutor, IRequestExecutor} from '../command-executor';
import {Observable, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {
  ICommandHttpResponse,
  ICommandResponse,
  IExecuteRequest,
  IHttpCommand,
  IRequestCommand
} from '@sneat/datatug/dto';
import {IExecuteResponse} from '@sneat/datatug/dto';

@Injectable({
	providedIn: 'root'
})
export class HttpExecutor implements IRequestExecutor, ICommandExecutor {
	constructor(
		private httpClient: HttpClient,
	) {
	}

	execute(agentId: string, request: IExecuteRequest): Observable<IExecuteResponse> {
		return undefined
	}

	executeCommand(command: IRequestCommand): Observable<ICommandResponse> {
		if (command.type !== 'HTTP') {
			return throwError(`HttpExecutor does not support command type: ${command.type}`);
		}
		const httpCommand = command as unknown as IHttpCommand;
		return this.httpClient
			.get(httpCommand.url)
			.pipe(
				map(httpResponse => {
					const httpResponseItem: ICommandHttpResponse = {
						type: 'object',
						value: httpResponse,
					};
					return {
						commandId: command.id,
						items: of(httpResponseItem),
					};
				}),
			);
	}
}
