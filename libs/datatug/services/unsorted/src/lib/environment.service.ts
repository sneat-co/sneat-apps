import { Injectable, inject } from '@angular/core';
import { IRecord } from '@sneat/data';
import { Observable, of, throwError } from 'rxjs';

import { SneatApiService } from '@sneat/api';
import { StoreApiService } from '@sneat/ext-datatug-services-repo';
import { CreateNamedRequest } from '@sneat/ext-datatug-dto';
import {
	IEnvironmentSummary,
	IOptionallyTitled,
} from '@sneat/ext-datatug-models';
import { createProjItem } from '@sneat/ext-datatug-services-base';
import { startWith, tap } from 'rxjs/operators';
import { IProjectRef } from '@sneat/ext-datatug-core';
import {
	ProjectContextService,
	ProjectService,
} from '@sneat/ext-datatug-services-project';

const getEnvCacheKey = (projectRef: IProjectRef, env: string): string => {
	return `${projectRef.projectId}@${projectRef.storeId}/${env}`;
};

const envSummaryCache: Record<string, IEnvironmentSummary> = {};

@Injectable()
export class EnvironmentService {
	private readonly projectContextService = inject(ProjectContextService);
	private readonly api = inject(SneatApiService);
	private readonly projectService = inject(ProjectService);
	private readonly storeApiService = inject(StoreApiService);

	createEnvironment = (
		request: CreateNamedRequest,
	): Observable<IRecord<IOptionallyTitled>> =>
		createProjItem<IEnvironmentSummary>(
			this.api,
			'datatug/environment/create_environment',
			request,
		);

	putConnection(): Observable<IEnvironmentSummary> {
		return throwError(() => '');
	}

	public getEnvSummary(
		projectRef: IProjectRef,
		env: string,
		forceReload = false,
	): Observable<IEnvironmentSummary> {
		if (!projectRef) {
			return throwError(() => '"projRef" is a required parameter');
		}
		if (!env) {
			return throwError(() => '"env" is a required parameter');
		}
		const cacheKey = getEnvCacheKey(projectRef, env);
		const cached = envSummaryCache[cacheKey];
		if (cached && !forceReload) {
			return of(cached);
		}
		const result = this.storeApiService
			.get<IEnvironmentSummary>(projectRef.storeId, '/environment-summary', {
				params: {
					proj: projectRef.projectId,
					env,
				},
			})
			.pipe(
				tap((envSummary) => {
					envSummaryCache[cacheKey] = envSummary;
				}),
			);
		return cached ? result.pipe(startWith(cached)) : result;
	}
}
