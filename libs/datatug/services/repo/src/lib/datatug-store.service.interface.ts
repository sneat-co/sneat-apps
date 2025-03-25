import { Observable } from 'rxjs';
import { IProjectSummary } from '@sneat/ext-datatug-models';

export interface IDatatugStoreService {
	getProjectSummary(projectId: string): Observable<IProjectSummary>;

	watchProjectItem<T>(
		projectId: string,
		path: string,
	): Observable<T | null | undefined>;
}
