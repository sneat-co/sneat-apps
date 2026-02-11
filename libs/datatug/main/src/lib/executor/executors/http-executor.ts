import { ICommandResponse } from '../../dto/command-response';
import { IExecuteResponse } from '../../dto/execute';
import { IExecuteRequest } from '../../dto/request';
import { IHttpCommand, IRequestCommand } from '../../dto/requests';
import { ICommandHttpResponse } from '../../dto/response';
import { ICommandExecutor, IRequestExecutor } from '../command-executor';
import { Observable, throwError } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpExecutor implements IRequestExecutor, ICommandExecutor {
  private httpClient = inject(HttpClient);

  execute(
    agentId: string,
    request: IExecuteRequest,
  ): Observable<IExecuteResponse> {
    throw new Error(`Not implemented yet ${agentId} ${request}`); // TODO: Needs implementation
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
          items: [httpResponseItem],
        };
        return result;
      }),
    );
  }
}
