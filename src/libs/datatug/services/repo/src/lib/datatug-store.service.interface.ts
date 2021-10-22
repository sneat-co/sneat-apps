import { Observable } from 'rxjs';
import { IProjectSummary } from '@sneat/datatug/models';

export interface IDatatugStoreService {
	getProjectSummary(projectId: string): Observable<IProjectSummary>;

	watchProjectItem<T>(projectId: string, path: string): Observable<T | null>;
}
