import { Observable } from 'rxjs';
import { ICommandResponse, IRequestCommand } from '@sneat/ext-datatug-dto';

// This
export class IndexedDbExecutor {
	execute(command: IRequestCommand): Observable<ICommandResponse> {
		throw new Error(`Not implemented yet ${command}`); // TODO: Needs implementation
	}
}
