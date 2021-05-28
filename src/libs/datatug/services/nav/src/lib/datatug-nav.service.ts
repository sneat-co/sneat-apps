import {Inject, Injectable} from '@angular/core';
import {NavController} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {NavigationOptions} from '@ionic/angular/providers/nav-controller';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {IDatatugProjectSummary, IProjBoard, IProjEntity, IProjEnv, IQueryDef,} from '@sneat/datatug/models';
import {getStoreId} from "@sneat/datatug/nav";

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

	goStore(storeId: string): void {
		if (!storeId) {
			throw new Error("storeId is a required parameter");
		}
		const repoId = getStoreId(storeId);
		this.navRoot(['store', storeId], 'Failed to navigate to store page');
	}

	goProject(storeId: string, projectId: string, page?: ProjectTopLevelPage): void {
		const url = ['store', storeId, 'project', projectId];
		if (page) {
			url.push(page);
		}
		this.navRoot(url, 'Failed to navigate to project page ' + page);
	}

	goEnvironment(projContext: IDatatugProjRef, projEnv: IProjEnv, envId?: string): void {
		const url = this.projectPageUrl(projContext, 'env', projEnv?.id || envId);
		this.navForward(url, {state: {projEnv}}, 'Failed to navigate to environment page');
	}

	goEntity(projContext: IDatatugProjRef, projEntity: IProjEntity, entityId?: string): void {
		const url = this.projectPageUrl(projContext, 'entity', projEntity?.id || entityId);
		this.navForward(url, {state: {projEntity}}, 'Failed to navigate to entity page');
	}

	goQuery(projContext: IDatatugProjRef, query: IQueryDef, action?: 'execute' | 'edit'): void {
		console.log('goQuery', query.id);
		const url = this.projectPageUrl(projContext, 'query');
		this.navForward(url, {
			state: {
				query,
				action,
			},
			queryParams: {
				id: query.id,
			}
		}, 'Failed to navigate to query page');
	}

	goBoard(projContext: IDatatugProjRef, projBoard: IProjBoard, boardId?: string): void {
		const url = this.projectPageUrl(projContext, 'board', projBoard?.id || boardId);
		this.navForward(url, {state: {projBoard}}, 'Failed to navigate to board page');
	}

	public projectPageUrl(c: IDatatugProjRef, name: string, id?: string): string {
		const url = `/store/${getStoreId(c.repoId)}/project/${c.projectId}/${name}`;
		return id ? url + '/' + encodeURIComponent(id) : url;
	}

	goProjPage(storeId: string, projectId: string, projPage: string, state?: { projSummary: IDatatugProjectSummary }): void {
		this.navForward(['store', storeId, 'project', projectId, projPage],
			{state}, 'Failed to navigate to project page: ' + projPage);
	}

	goTable(to: IDbObjectNavParams): void {
		const url = [
			'project', `${to.target.projectId}@${getStoreId(to.target.repoId)}`,
			'env', to.env,
			'db', to.db,
			'table', `${to.schema}.${to.name}`,
		];
		this.navRoot(url, 'Failed to navigate to environment table page');
	}

	private navRoot(url: string[] | string, errMessage: string): void {
		console.log('navRoot', url);
		this.nav.navigateRoot(url)
			.catch(err => this.errorLogger.logError(err, errMessage));
	}

	private navForward(url: string[] | string, options: NavigationOptions, errMessage: string): void {
		console.log('navForward()', url, options);
		this.nav.navigateForward(url, options)
			.catch(this.errorLogger.logErrorHandler(errMessage));
	}
}

export interface IDbObjectNavParams {
	target: IDatatugProjRef;
	env: string;
	db: string;
	schema: string;
	name: string;
}
