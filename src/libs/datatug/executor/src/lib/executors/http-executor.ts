import { ICommandExecutor, IRequestExecutor } from '../command-executor';
import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
	ICommandHttpResponse,
	ICommandResponse,
	IExecuteRequest,
	IExecuteResponse,
	IHttpCommand,
	IRequestCommand,
} from '@sneat/datatug/dto';

@Injectable({
	providedIn: 'root',
})
export class HttpExecutor implements IRequestExecutor, ICommandExecutor {
	constructor(private httpClient: HttpClient) {
	}

	execute(
		agentId: string,
		request: IExecuteRequest,
	): Observable<IExecuteResponse> {
		throw new Error('Not implemented yet'); // TODO: Needs implementation
	}

	executeCommand(command: IRequestCommand): Observable<ICommandResponse> {
		if (command.type !== 'HTTP') {
			return throwError(
				() => `HttpExecutor does not support command type: ${command.type}`,
			);
		}
		const httpCommand = command as unknown as IHttpCommand;
		return this.httpClient.get(httpCommand.url).pipe(
			map((httpResponse) => {
				const httpResponseItem: ICommandHttpResponse = {
					type: 'object',
					value: httpResponse,
				};
				if (!command.id) {
					throw new Error('command have no ID');
				}
				const result: ICommandResponse = {
					commandId: command.id,
					items: of(httpResponseItem),
				};
				return result;
			}),
		);
	}
}
