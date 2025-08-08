import { Injectable, inject } from '@angular/core';
import { IRecord } from '@sneat/data';
import { Observable, of, throwError } from 'rxjs';

import { SneatApiService } from '@sneat/api';
import { startWith, tap } from 'rxjs/operators';
import { IProjectRef } from '../../core/project-context';
import { CreateNamedRequest } from '../../dto/requests';
import { IOptionallyTitled } from '../../models/core';
import { IEnvironmentSummary } from '../../models/definition/environments';
import { createProjItem } from '../base/create-object';
import { ProjectContextService } from '../project/project-context.service';
import { ProjectService } from '../project/project.service';
import { StoreApiService } from '../repo/store-api.service';

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
