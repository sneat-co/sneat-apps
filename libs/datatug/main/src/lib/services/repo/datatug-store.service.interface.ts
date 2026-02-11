import { Observable } from 'rxjs';
import { IProjectSummary } from '../../models/definition/project';

export interface IDatatugStoreService {
  getProjectSummary(projectId: string): Observable<IProjectSummary>;

  watchProjectItem<T>(
    projectId: string,
    path: string,
  ): Observable<T | null | undefined>;
}
