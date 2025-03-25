import { Observable } from 'rxjs';
import {
	ICommandResponse,
	IExecuteRequest,
	IExecuteResponse,
	IRequestCommand,
} from '@sneat/ext-datatug-dto';

export interface ICommandExecutor {
	executeCommand(command: IRequestCommand): Observable<ICommandResponse>;
}

export interface IRequestExecutor {
	execute(
		agentId: string,
		request: IExecuteRequest,
	): Observable<IExecuteResponse>;
}
