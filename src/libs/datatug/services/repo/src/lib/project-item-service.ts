import {Observable, throwError} from 'rxjs';
import {startWith, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {StoreApiService} from '@sneat/datatug/services/repo';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {IProjItemBrief, IProjItemsFolder} from '@sneat/datatug/models';

const notImplemented = 'not implemented';

@Injectable()
export class ProjectItemServiceFactory {
	public readonly newProjectItemService = (
		agentProvider: StoreApiService,
		itemsPath: string,
		itemPath: string,
	) => new ProjectItemService(agentProvider, itemsPath, itemPath);
}

// TODO: why it's complaining about TS1219?
export class ProjectItemService<ProjItem extends IProjItemBrief> {

	private cache: { [id: string]: ProjItem } = {};

	constructor(
		private readonly agentProvider: StoreApiService,
		private readonly itemsPath: string,
		private readonly itemPath: string,
	) {
	}

	public getProjItems(from: IDatatugProjRef, folderPath: string): Observable<ProjItem[]> {
		console.log('getProjItems', from, folderPath);
		return this.agentProvider.get<ProjItem[]>(from.repoId, `/${this.itemsPath}/all_${this.itemsPath}`, {
			params: {
				project: from.projectId,
				folder: folderPath,
			}
		}).pipe(
			tap(items => {
				const folder: IProjItemsFolder = {
					id: folderPath && folderPath.split('/').pop() || folderPath,
					items,
				};
				this.putProjItemsToCache(folder, folderPath);
			}),
		);
	}

	public getFolder<T extends IProjItemsFolder>(from: IDatatugProjRef, folderPath: string): Observable<T> {
		console.log('getFolder', from, folderPath);
		return this.agentProvider.get<T>(from.repoId, `/${this.itemsPath}/all_${this.itemsPath}`, {
			params: {
				project: from.projectId,
				folder: folderPath,
			}
		}).pipe(
			tap(folder => {
				if (!this.cache) {
					this.cache = {};
				}
				this.putProjItemsToCache(folder, folderPath);
			}),
		);
	}

	private putProjItemsToCache(folder: IProjItemsFolder, path: string): void {
		if (!this.cache) {
			this.cache = {};
		}
		if (folder?.items) {
			const keyPrefix = path ? path + '/' : '';
			folder.items.forEach(item => this.putProjItemToCache(item as ProjItem, keyPrefix + item.id))
		}

	}

	private putProjItemToCache = (item: ProjItem, key: string): void => {
		if (item.id || key) {
			this.cache[item.id || key] = item;
		}
	}

	public getProjItem(from: IDatatugProjRef, id: string): Observable<ProjItem> {
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

	public createProjItem(target: IDatatugProjRef, projItem: ProjItem, itemPath = this.itemPath): Observable<ProjItem> {
		return this.agentProvider.put(target.repoId, `/${this.itemsPath}/create_${itemPath}`, projItem, {
			params: {
				project: target.projectId,
				id: projItem.id,
			},
		});
	}

	public updateProjItem(target: IDatatugProjRef, projItem: ProjItem): Observable<ProjItem> {
		return this.agentProvider.put(target.repoId, `/${this.itemsPath}/update_${this.itemPath}`, projItem, {
			params: {
				project: target.projectId,
				id: projItem.id,
			},
		});
	}

	public deleteProjItem(target: IDatatugProjRef, id: string, itemPath = this.itemPath): Observable<void> {
		return this.agentProvider.delete(target.repoId, `/${this.itemsPath}/delete_${itemPath}`, {
			params: {
				project: target.projectId,
				id,
			},
		});
	}
}

