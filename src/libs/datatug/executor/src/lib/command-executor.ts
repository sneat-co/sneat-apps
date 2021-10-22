import { Observable } from 'rxjs';
import { IExecuteResponse } from '@sneat/datatug/dto';
import {
	ICommandResponse,
	IExecuteRequest,
	IRequestCommand,
} from '@sneat/datatug/dto';

export interface ICommandExecutor {
	executeCommand(command: IRequestCommand): Observable<ICommandResponse>;
}

export interface IRequestExecutor {
	execute(
		agentId: string,
		request: IExecuteRequest
	): Observable<IExecuteResponse>;
}
