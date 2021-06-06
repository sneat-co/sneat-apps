import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {GITHUB_REPO, IDatatugProjRef} from '@sneat/datatug/core';
import {ProjectItemsByAgent} from './caching';
import {StoreApiService} from '@sneat/datatug/services/repo';
import {IRecord, mapToRecord} from '@sneat/data';
import {IEntity} from '@sneat/datatug/models';

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


	public getEntity = (repo: string, project: string, entityId: string): Observable<IRecord<IEntity>> => {
		switch (repo) {
			case GITHUB_REPO:
				return this.getEntityFromGithub(project, entityId);
			default:
				return this.agentProvider
					.get(repo, '/entities/entity', {params: {project, id: entityId}})
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

	public getAllEntities = (from: IDatatugProjRef, forceReload?: boolean): Observable<IRecord<IEntity>[]> => {
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

	public createEntity = (projContext: IDatatugProjRef, entity: IEntity): Observable<IRecord<IEntity>> => {
		const {storeId, projectId} = projContext;
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

	public deleteEntity = (from: IDatatugProjRef, entityId: string): Observable<void> => {
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

