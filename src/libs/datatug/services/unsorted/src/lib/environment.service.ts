import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {ProjectContextService, ProjectService} from '@sneat/datatug/services/project';
import {SneatTeamApiService} from '@sneat/api';
import {RepoApiService} from '@sneat/datatug/services/repo';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {IEnvironmentSummary} from '@sneat/datatug/models';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {createProjItem} from "@sneat/datatug/services/base";
import {startWith, tap} from "rxjs/operators";

const getEnvCacheKey = (projRef: IDatatugProjRef, env: string): string => {
	return `${projRef.projectId}@${projRef.repoId}/${env}`;
};

@Injectable({
	providedIn: 'root'
})
export class EnvironmentService {

	private readonly envSummaryCache: { [key: string]: IEnvironmentSummary } = {};

	constructor(
		private readonly projectContextService: ProjectContextService,
		private readonly api: SneatTeamApiService,
		private readonly projService: ProjectService,
		private readonly repoApiService: RepoApiService,
		// private readonly http: HttpClient,
	) {
	}

	createEnvironment = (request: CreateNamedRequest): Observable<any> =>
		createProjItem<IEnvironmentSummary>(this.api, 'datatug/environment/create_environment', request)

	putConnection(): Observable<IEnvironmentSummary> {
		return throwError('')
	}

	public getEnvSummary(projRef: IDatatugProjRef, env: string, forceReload: boolean = false)
		: Observable<IEnvironmentSummary> {
		if (!projRef) {
			return throwError('"projRef" is a required parameter');
		}
		if (!env) {
			return throwError('"env" is a required parameter');
		}
		const cacheKey = getEnvCacheKey(projRef, env);
		const cached = this.envSummaryCache[cacheKey];
		if (cached && !forceReload) {
			return of(cached)
		}
		const result =
			this.repoApiService.get<IEnvironmentSummary>(projRef.repoId, '/environment-summary', {
				params: {
					proj: projRef.projectId,
					env
				}
			}).pipe(tap(envSummary => {
				this.envSummaryCache[cacheKey] = envSummary;
			}));
		return cached ? result.pipe(startWith(cached)) : result;
	}
}
