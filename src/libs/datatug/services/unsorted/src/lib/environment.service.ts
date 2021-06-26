import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {ProjectContextService, ProjectService} from '@sneat/datatug/services/project';
import {SneatTeamApiService} from '@sneat/api';
import {StoreApiService} from '@sneat/datatug/services/repo';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {IEnvironmentSummary} from '@sneat/datatug/models';
import {createProjItem} from "@sneat/datatug/services/base";
import {startWith, tap} from "rxjs/operators";
import {IProjectRef} from '@sneat/datatug/core';

const getEnvCacheKey = (projectRef: IProjectRef, env: string): string => {
	return `${projectRef.projectId}@${projectRef.storeId}/${env}`;
};

const envSummaryCache: { [key: string]: IEnvironmentSummary } = {};

@Injectable({providedIn: 'root'})
export class EnvironmentService {

	constructor(
		private readonly projectContextService: ProjectContextService,
		private readonly api: SneatTeamApiService,
		private readonly projectService: ProjectService,
		private readonly storeApiService: StoreApiService,
		// private readonly http: HttpClient,
	) {
	}

	createEnvironment = (request: CreateNamedRequest): Observable<any> =>
		createProjItem<IEnvironmentSummary>(this.api, 'datatug/environment/create_environment', request)

	putConnection(): Observable<IEnvironmentSummary> {
		return throwError('')
	}

	public getEnvSummary(projectRef: IProjectRef, env: string, forceReload: boolean = false)
		: Observable<IEnvironmentSummary> {
		if (!projectRef) {
			return throwError('"projRef" is a required parameter');
		}
		if (!env) {
			return throwError('"env" is a required parameter');
		}
		const cacheKey = getEnvCacheKey(projectRef, env);
		const cached = envSummaryCache[cacheKey];
		if (cached && !forceReload) {
			return of(cached)
		}
		const result =
			this.storeApiService.get<IEnvironmentSummary>(projectRef.storeId, '/environment-summary', {
				params: {
					proj: projectRef.projectId,
					env
				}
			}).pipe(tap(envSummary => {
				envSummaryCache[cacheKey] = envSummary;
			}));
		return cached ? result.pipe(startWith(cached)) : result;
	}
}
