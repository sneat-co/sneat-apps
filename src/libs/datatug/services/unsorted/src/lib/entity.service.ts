import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {GITHUB_REPO, IProjectContext} from '@sneat/datatug/core';
import {ProjectItemsByAgent} from './caching';
import {RepoApiService} from '@sneat/datatug/services/repo';
import {IRecord} from '@sneat/data';
import {IEntity} from '@sneat/datatug/models';

@Injectable()
export class EntityService {

	private cache = new ProjectItemsByAgent<IRecord<IEntity>>();

	constructor(
		// private readonly api: SneatTeamApiService,
		private readonly agentProvider: RepoApiService,
		private readonly http: HttpClient,
	) {
		// console.log('EntityService.constructor()');
	}

	public getEntity = (repo: string, project: string, entityId: string): Observable<IRecord<IEntity>> => {
		// do not auto-format
		switch (repo) {
			case GITHUB_REPO:
				const [ghRepo, org] = project.split('@');
				const url = `https://raw.githubusercontent.com/${org}/${ghRepo}/main/entities/${entityId}.json`;
				return this.http.get<IEntity>(url)
					.pipe(
						mergeMap(data => {
							if (!data.extends?.def) {
								return of(data);
							}
							return this.http
								.get<IEntity>(data.extends.def)
								.pipe(
									map(def => ({
										...data,
										fields: def.fields,
										options: def.options,
									})),
								)
						}),
						map(data => ({id: entityId, data})),
						tap(record => console.log('Entity record:', record)),
					);
			default:
				return this.agentProvider.get(repo, '/entities/entity', {params: {project, id: entityId}});
		}
	}

	public getAllEntities = (from: IProjectContext, forceReload?: boolean): Observable<IRecord<IEntity>[]> => {
		console.log('EntityService.getAllEntities()');
		let o = this.cache.getItems$(from);
		if (!o || forceReload) {
			const entities$ = this.cache.byRepo$[from.repoId]?.[from.projectId];
			const records = entities$?.getValue();
			o = this.agentProvider
				.get<IEntity[]>(from.repoId, '/entities/all_entities', {params: {project: from.projectId}})
				.pipe(
					map(
						entities => entities.map(
							entity => ({
								id: entity.id,
								data: entity,
								state: records?.find(v => v.id === entity.id)?.state,
							}),
						),
					),
				);
			o = this.cache.setItems$(from, o);
		}
		return o;
	};

	public createEntity = (projContext: IProjectContext, entity: IEntity): Observable<IRecord<IEntity>> => {
		const {repoId, projectId} = projContext;
		const entities$ = this.cache.byRepo$[repoId][projectId];
		return this.agentProvider
			.post<IRecord<IEntity>>(repoId, '/entities/create_entity', entity, {params: {project: projectId}})
			.pipe(
				tap(() => {
					entities$.next([...entities$.getValue(), {id: entity.id, data: entity}]);
				}),
			)
	};

	public saveEntity = (repo: string, project: string, request: IEntity): Observable<IRecord<IEntity>> =>
		this.agentProvider.put(repo, '/entities/save_entity', request, {params: {project}});

	public deleteEntity = (from: IProjectContext, entityId: string): Observable<void> => {
		const entities$ = this.cache.byRepo$[from.repoId][from.projectId];
		entities$.next(entities$.getValue().map(entity => entity.id === entityId ? {
			...entity,
			state: 'deleting'
		} : entity));
		return this.agentProvider
			.delete<void>(from.repoId, '/entities/delete_entity',
				{params: {project: from.projectId, entity: entityId}})
			.pipe(
				// delay(1000),
				tap(() => {
					entities$.next(entities$.getValue().filter(entity => entity.id !== entityId));
				}),
			);
	};
}

