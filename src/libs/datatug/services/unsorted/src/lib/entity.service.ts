import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ProjectItemsByAgent} from './caching';
import {StoreApiService} from '@sneat/datatug/services/repo';
import {IRecord, mapToRecord} from '@sneat/data';
import {IEntity} from '@sneat/datatug/models';
import {STORE_ID_GITHUB_COM} from '@sneat/core';
import {IProjectRef} from '@sneat/datatug/core';

@Injectable()
export class EntityService {

	private cache = new ProjectItemsByAgent<IRecord<IEntity>>();

	constructor(
		// private readonly api: SneatTeamApiService,
		private readonly agentProvider: StoreApiService,
		private readonly http: HttpClient,
	) {
		// console.log('EntityService.constructor()');
	}


	public getEntity = (store: string, project: string, entityId: string): Observable<IRecord<IEntity>> => {
		switch (store) {
			case STORE_ID_GITHUB_COM:
				return this.getEntityFromGithub(project, entityId);
			default:
				return this.agentProvider
					.get(store, '/entities/entity', {params: {project, id: entityId}})
					.pipe(
						mapToRecord<IEntity>(),
					);
		}
	}

	private getEntityFromGithub(project: string, entityId: string): Observable<IRecord<IEntity>> {
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
				mapToRecord<IEntity>(),
				tap(record => console.log('Entity record:', record)),
			);
	}

	public getAllEntities = (from: IProjectRef, forceReload?: boolean): Observable<IRecord<IEntity>[]> => {
		console.log('EntityService.getAllEntities()');
		let o = this.cache.getItems$(from);
		if (!o || forceReload) {
			const entities$ = this.cache.byRepo$[from.storeId]?.[from.projectId];
			const records = entities$?.getValue();
			o = this.agentProvider
				.get<IEntity[]>(from.storeId, '/entities/all_entities', {params: {project: from.projectId}})
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

	public createEntity = (projectRef: IProjectRef, entity: IEntity): Observable<IRecord<IEntity>> => {
		const {storeId, projectId} = projectRef;
		const entities$ = this.cache.byRepo$[storeId][projectId];
		return this.agentProvider
			.post<IRecord<IEntity>>(storeId, '/entities/create_entity', entity, {params: {project: projectId}})
			.pipe(
				tap(() => {
					entities$.next([...entities$.getValue(), {id: entity.id, data: entity}]);
				}),
			)
	};

	public saveEntity = (repo: string, project: string, request: IEntity): Observable<IRecord<IEntity>> =>
		this.agentProvider.put(repo, '/entities/save_entity', request, {params: {project}});

	public deleteEntity = (from: IProjectRef, entityId: string): Observable<void> => {
		const entities$ = this.cache.byRepo$[from.storeId][from.projectId];
		entities$.next(entities$.getValue().map(entity => entity.id === entityId ? {
			...entity,
			state: 'deleting'
		} : entity));
		return this.agentProvider
			.delete<void>(from.storeId, '/entities/delete_entity',
				{params: {project: from.projectId, entity: entityId}})
			.pipe(
				// delay(1000),
				tap(() => {
					entities$.next(entities$.getValue().filter(entity => entity.id !== entityId));
				}),
			);
	};
}

