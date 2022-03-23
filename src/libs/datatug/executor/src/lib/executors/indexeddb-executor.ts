import { Observable } from 'rxjs';
import { ICommandResponse, IRequestCommand } from '@sneat/datatug/dto';

// This
export class IndexedDbExecutor {
	execute(command: IRequestCommand): Observable<ICommandResponse> {
		throw new Error('Not implemented yet'); // TODO: Needs implementation
	}
}
