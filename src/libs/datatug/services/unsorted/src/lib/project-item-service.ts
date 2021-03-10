import {Observable, throwError} from 'rxjs';
import {startWith, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RepoApiService} from '@sneat/datatug/services/repo';
import {IProjectContext} from '@sneat/datatug/core';
import {IProjItemBrief} from '@sneat/datatug/models';

const notImplemented = 'not implemented';

@Injectable()
export class ProjectItemServiceFactory {
	public readonly newProjectItemService = (
		agentProvider: RepoApiService,
		itemsPath: string,
		itemPath: string,
	) => new ProjectItemService(agentProvider, itemsPath, itemPath);
}

// TODO: why it's complaining about TS1219?
export class ProjectItemService<ProjItem extends IProjItemBrief> {

	private cache: { [id: string]: ProjItem } = {};

	constructor(
		private readonly agentProvider: RepoApiService,
		private readonly itemsPath: string,
		private readonly itemPath: string,
	) {
	}

	public getProjItems(from: IProjectContext, folder: string): Observable<ProjItem[]> {
		console.log('getProjItems', from, folder);
		return this.agentProvider.get<ProjItem[]>(from.repoId, `/${this.itemsPath}/all_${this.itemsPath}`, {
			params: {
				project: from.projectId,
				folder
			}
		}).pipe(
			tap(items => {
				this.cache = {};
				if (items) {
					items.forEach(this.putProjItemToCache)
				}
			}),
		);
	}

	private putProjItemToCache = (item: ProjItem): void => {
		if (item.id) {
			this.cache[item.id] = item;
		}
	}

	public getProjItem(from: IProjectContext, id: string): Observable<ProjItem> {
		let o = this.agentProvider.get<ProjItem>(from.repoId, `/${this.itemsPath}/get_${this.itemPath}`, {
			params: {
				project: from.projectId,
				[this.itemPath]: id,
			}
		});
		const cached = this.cache[id];
		if (cached) {
			o = o.pipe(startWith(cached as ProjItem));
		}
		return o;
	}

	public createProjItem(projId: string, projItem: ProjItem): Observable<ProjItem> {
		return throwError(notImplemented + ` createProjItem(${projId}, ${JSON.stringify(projItem)}`);
	}

	public updateProjItem(projId: string, projItem: ProjItem): Observable<ProjItem> {
		return throwError(notImplemented + ` updateProjItem(${projId}, ${JSON.stringify(projItem)}`);
	}

	public deleteProjItem(projId: string, id: string): Observable<ProjItem> {
		return throwError(notImplemented + ` deleteProjItem(${projId}, ${id}`);
	}
}

