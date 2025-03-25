import { Observable } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { IProjectRef } from '@sneat/ext-datatug-core';
import { IProjItemBrief, IProjItemsFolder } from '@sneat/ext-datatug-models';
import { StoreApiService } from './store-api.service';
import {
	collection,
	doc,
	docSnapshots,
	Firestore as AngularFirestore,
} from '@angular/fire/firestore';

// const notImplemented = 'not implemented';

@Injectable()
export class ProjectItemServiceFactory {
	public readonly newProjectItemService = (
		db: AngularFirestore,
		storeApiService: StoreApiService,
		itemsPath: string,
		itemPath: string,
	) => new ProjectItemService(db, storeApiService, itemsPath, itemPath);
}

// TODO: why it's complaining about TS1219?
export class ProjectItemService<ProjItem extends IProjItemBrief> {
	private cache: Record<string, ProjItem> = {};

	constructor(
		private readonly db: AngularFirestore,
		private readonly storeApiService: StoreApiService,
		private readonly itemsPath: string,
		private readonly itemPath: string,
	) {}

	public getProjItems(
		from: IProjectRef,
		folderPath: string,
	): Observable<ProjItem[]> {
		console.log('getProjItems', from, folderPath);
		return this.storeApiService
			.get<ProjItem[]>(
				from.storeId,
				`/${this.itemsPath}/all_${this.itemsPath}`,
				{
					params: {
						project: from.projectId,
						folder: folderPath,
					},
				},
			)
			.pipe(
				tap((items) => {
					const folder: IProjItemsFolder = {
						id: (folderPath && folderPath.split('/').pop()) || folderPath,
						items,
					};
					this.putProjItemsToCache(folder, folderPath);
				}),
			);
	}

	public getFolder<T extends IProjItemsFolder>(
		from: IProjectRef,
		folderPath: string,
	): Observable<T | null | undefined> {
		console.log('getFolder', from, folderPath);
		if (from.storeId === 'firestore') {
			return this.watchFirestoreFolder<T>(from.projectId, folderPath).pipe(
				take(1),
			);
		}
		return this.storeApiService
			.get<T>(from.storeId, `/${this.itemsPath}/all_${this.itemsPath}`, {
				params: {
					project: from.projectId,
					folder: folderPath,
				},
			})
			.pipe(
				tap((folder) => {
					if (!this.cache) {
						this.cache = {};
					}
					this.putProjItemsToCache(folder, folderPath);
				}),
			);
	}

	private watchFirestoreFolder<T>(
		projectId: string,
		folderPath: string,
	): Observable<T | null | undefined> {
		console.log('watchFirestoreFolder', projectId, folderPath);
		const datatugProjects = collection(this.db, 'datatug_projects');
		const project = doc(datatugProjects, projectId);
		const queries = collection(project, 'queries');
		const d = doc(queries, '~');

		return docSnapshots(d).pipe(
			map((changes) => {
				if (!changes) {
					return undefined;
				}
				if (!changes.exists()) {
					return null;
				}
				return changes.data() as unknown as T;
			}),
		);
	}

	private putProjItemsToCache(folder: IProjItemsFolder, path: string): void {
		if (!this.cache) {
			this.cache = {};
		}
		if (folder?.items) {
			const keyPrefix = path ? path + '/' : '';
			folder.items.forEach((item) =>
				this.putProjItemToCache(item as ProjItem, keyPrefix + item.id),
			);
		}
	}

	private putProjItemToCache = (item: ProjItem, key: string): void => {
		if (item.id || key) {
			this.cache[item.id || key] = item;
		}
	};

	public getProjItem(
		projectRef: IProjectRef,
		id: string,
	): Observable<ProjItem> {
		let o = this.storeApiService.get<ProjItem>(
			projectRef.storeId,
			`/${this.itemsPath}/get_${this.itemPath}`,
			{
				params: {
					project: projectRef.projectId,
					[this.itemPath]: id,
				},
			},
		);
		const cached = this.cache[id];
		if (cached) {
			o = o.pipe(startWith(cached as ProjItem));
		}
		return o;
	}

	public createProjItem(
		projectRef: IProjectRef,
		projItem: ProjItem,
		itemPath = this.itemPath,
	): Observable<ProjItem> {
		const params: Record<string, string | string[]> = {
			project: projectRef.projectId,
			id: projItem.id,
		};
		if (projectRef.storeId === 'firestore') {
			params['store'] = projectRef.storeId;
		}
		return this.storeApiService.put(
			projectRef.storeId,
			`/${this.itemsPath}/create_${itemPath}`,
			projItem,
			{ params },
		);
	}

	public updateProjItem(
		projectRef: IProjectRef,
		projItem: ProjItem,
	): Observable<ProjItem> {
		return this.storeApiService.put(
			projectRef.storeId,
			`/${this.itemsPath}/update_${this.itemPath}`,
			projItem,
			{
				params: {
					project: projectRef.projectId,
					id: projItem.id,
				},
			},
		);
	}

	public deleteProjItem(
		projectRef: IProjectRef,
		id: string,
		itemPath = this.itemPath,
	): Observable<void> {
		return this.storeApiService.delete(
			projectRef.storeId,
			`/${this.itemsPath}/delete_${itemPath}`,
			{
				params: {
					project: projectRef.projectId,
					id,
				},
			},
		);
	}
}
