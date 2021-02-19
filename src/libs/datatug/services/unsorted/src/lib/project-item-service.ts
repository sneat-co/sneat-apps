import {Observable} from 'rxjs';
import {startWith, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RepoProviderService} from '@sneat/datatug/services/repo';
import {IProjectContext} from '@sneat/datatug/core';
import {IProjItemBrief} from '@sneat/datatug/models';

@Injectable()
export class ProjectItemServiceFactory {
	public readonly newProjectItemService = (
		agentProvider: RepoProviderService,
		itemsPath: string,
		itemPath: string,
	) => new ProjectItemService(agentProvider, itemsPath, itemPath);
}

// @Injectable()
// @ts-ignore // TODO: why it's complaining about TS1219?
export class ProjectItemService<ProjItem> {

	private cache: { [id: string]: ProjItem } = {};

	constructor(
		private readonly agentProvider: RepoProviderService,
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
				items.forEach(item => {
					const id = (item as unknown as IProjItemBrief).id;
					if (id) {
						this.cache[id] = item;
					}
				})
			}),
		);
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
			o = o.pipe(startWith(cached));
		}
		return o;
	}

	public createProjItem(projId: string, projItem: ProjItem): Observable<ProjItem> {
		return null;
	}

	public updateProjItem(projId: string, projItem: ProjItem): Observable<ProjItem> {
		return null;
	}

	public deleteProjItem(projId: string, id: string): Observable<ProjItem> {
		return null;
	}
}
