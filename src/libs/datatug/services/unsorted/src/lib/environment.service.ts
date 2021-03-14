import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {ProjectContextService, ProjectService} from '@sneat/datatug/services/project';
import {SneatTeamApiService} from '@sneat/api';
import {RepoApiService} from '@sneat/datatug/services/repo';
import {CreateNamedRequest} from '@sneat/datatug/dto';
import {IEnvironmentSummary} from '@sneat/datatug/models';
import {IProjectContext} from '@sneat/datatug/core';
import {createProjItem} from "@sneat/datatug/services/base";

@Injectable({
	providedIn: 'root'
})
export class EnvironmentService {

	constructor(
		private readonly projectContextService: ProjectContextService,
		private readonly api: SneatTeamApiService,
		private readonly projService: ProjectService,
		private readonly agentProvider: RepoApiService,
		// private readonly http: HttpClient,
	) {
	}

	createEnvironment = (request: CreateNamedRequest): Observable<any> =>
		createProjItem<IEnvironmentSummary>(this.api, 'datatug/environment/create_environment', request)

	putConnection(): Observable<IEnvironmentSummary> {
		return throwError('')
	}

	public getEnvSummary(projContext: IProjectContext, env: string): Observable<IEnvironmentSummary> {
		return this.agentProvider.get(projContext.repoId, '/environment-summary', {
			params: {
				proj: projContext.projectId,
				env
			}
		});
	}
}
