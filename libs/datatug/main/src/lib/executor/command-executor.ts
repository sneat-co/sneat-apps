import { Observable } from 'rxjs';
import { ICommandResponse } from '../dto/command-response';
import { IExecuteResponse } from '../dto/execute';
import { IExecuteRequest } from '../dto/request';
import { IRequestCommand } from '../dto/requests';

export interface ICommandExecutor {
	executeCommand(command: IRequestCommand): Observable<ICommandResponse>;
}

export interface IRequestExecutor {
	execute(
		agentId: string,
		request: IExecuteRequest,
	): Observable<IExecuteResponse>;
}
