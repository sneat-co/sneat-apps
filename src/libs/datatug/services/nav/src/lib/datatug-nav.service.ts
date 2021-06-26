import {Inject, Injectable} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {NavigationOptions} from '@ionic/angular/providers/nav-controller';
import {IProjBoard, IProjEntity, IProjEnv, IQueryDef,} from '@sneat/datatug/models';
import {getStoreId, IDatatugStoreContext, IProjectContext} from "@sneat/datatug/nav";
import {IProjectRef, isValidProjectRef} from '@sneat/datatug/core';
import {storeRefToId} from '@sneat/core';

export type ProjectTopLevelPage =
	'boards' |
	'dbmodels' |
	'entities' |
	'environments' |
	'servers' |
	'queries' |
	'query' |
	'tags' |
	'widgets';

@Injectable({
	providedIn: 'root' // TODO: embed explicitly
})
export class DatatugNavService {

	constructor(
		private readonly nav: NavController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	goStore(store: IDatatugStoreContext): void {
		if (!store?.ref) {
			throw new Error("store.ref is a required parameter");
		}
		const storeId = storeRefToId(store.ref);
		const options: NavigationOptions = store.brief ? {state: {store}} : undefined;
		this.navRoot(['store', storeId], 'Failed to navigate to store page', options);
	}

	goProject(project: IProjectContext, page?: ProjectTopLevelPage): void {
		const url = ['store', project.ref.storeId, 'project', project.ref.projectId];
		if (page) {
			url.push(page);
		}
		const options: NavigationOptions = project.brief ? {state: {project}} : undefined;
		this.navRoot(url, 'Failed to navigate to project page ' + page, options);
	}

	goEnvironment(project: IProjectContext, projEnv?: IProjEnv, envId?: string): void {
		const url = this.projectPageUrl(project.ref, 'env', projEnv?.id || envId);
		this.navForward(url, {state: {project, projEnv}}, 'Failed to navigate to environment page');
	}

	goEntity(project: IProjectContext, projEntity: IProjEntity, entityId?: string): void {
		const url = this.projectPageUrl(project.ref, 'entity', projEntity?.id || entityId);
		this.navForward(url, {state: {project, projEntity}}, 'Failed to navigate to entity page');
	}

	goQuery(project: IProjectContext, query: IQueryDef, action?: 'execute' | 'edit'): void {
		console.log('goQuery', query.id);
		const url = this.projectPageUrl(project.ref, 'query');
		this.navForward(url, {
			state: {
				project,
				query,
				action,
			},
			queryParams: {
				id: query.id,
			}
		}, 'Failed to navigate to query page');
	}

	goBoard(project: IProjectContext, projBoard: IProjBoard, boardId?: string): void {
		const url = this.projectPageUrl(project.ref, 'board', projBoard?.id || boardId);
		this.navForward(url, {state: {project, projBoard}}, 'Failed to navigate to board page');
	}

	public projectPageUrl(c: IProjectRef, name: string, id?: string): string {
		const url = `/store/${getStoreId(c.storeId)}/project/${c.projectId}/${name}`;
		return id ? url + '/' + encodeURIComponent(id) : url;
	}

	goProjPage(project: IProjectContext, projPage: string, state?: any): void {
		if (!project) {
			throw new Error('project is a required parameter');
		}
		if (!isValidProjectRef(project.ref)) {
			throw new Error('project.ref is a required parameter');
		}
		state = {...(state || {}), project};
		this.navForward(['store', project.ref.storeId, 'project', project.ref.projectId, projPage],
			{state}, 'Failed to navigate to project page: ' + projPage);
	}

	goTable(to: IDbObjectNavParams): void {
		const url = [
			'project', `${to.project.ref.projectId}@${getStoreId(to.project.ref.storeId)}`,
			'env', to.env,
			'db', to.db,
			'table', `${to.schema}.${to.name}`,
		];
		this.navRoot(url, 'Failed to navigate to environment table page');
	}

	private navRoot(url: string[] | string, errMessage: string, options?: NavigationOptions): void {
		console.log('navRoot', url);
		this.nav.navigateRoot(url, options)
			.catch(err => this.errorLogger.logError(err, errMessage));
	}

	private navForward(url: string[] | string, options: NavigationOptions, errMessage: string): void {
		console.log('navForward()', url, options);
		this.nav.navigateForward(url, options)
			.catch(this.errorLogger.logErrorHandler(errMessage));
	}
}

export interface IDbObjectNavParams {
	project: IProjectContext;
	env: string;
	db: string;
	schema: string;
	name: string;
}
