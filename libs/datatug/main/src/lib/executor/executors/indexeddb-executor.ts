import { Observable } from 'rxjs';
import { ICommandResponse } from '../../dto/command-response';
import { IRequestCommand } from '../../dto/requests';

// This
export class IndexedDbExecutor {
	execute(command: IRequestCommand): Observable<ICommandResponse> {
		throw new Error(`Not implemented yet ${command}`); // TODO: Needs implementation
	}
}
