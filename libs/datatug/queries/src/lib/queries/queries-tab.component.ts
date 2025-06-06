import { TitleCasePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonBadge,
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonText,
} from '@ionic/angular/standalone';
import { SqlEditorComponent } from '@sneat/ext-datatug-components-sqleditor';
import {
	IProjItemBrief,
	IQueryDef,
	IQueryFolder,
	IQueryFolderContext,
	ISqlQueryRequest,
	QueryItem,
} from '@sneat/ext-datatug-models';
import { Subscription } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ActivatedRoute, Router } from '@angular/router';
import { QueriesService } from '../queries.service';
import {
	DatatugNavContextService,
	DatatugNavService,
} from '@sneat/ext-datatug-services-nav';
import { IProjectContext } from '@sneat/ext-datatug-nav';

interface FilteredItem {
	//TODO: make readonly
	folders: string[];
	query: IQueryDef;
}

interface IParentFolder extends IQueryFolder {
	path: string;
}

type QueryType = 'SQL' | 'GraphQL' | 'HTTP';

@Component({
	selector: 'sneat-datatug-queries-tab',
	templateUrl: 'queries-tab.component.html',
	imports: [
		SqlEditorComponent,
		IonItem,
		IonLabel,
		IonInput,
		FormsModule,
		IonIcon,
		IonButton,
		IonButtons,
		IonItemDivider,
		IonBadge,
		IonText,
		TitleCasePipe,
	],
})
export class QueriesTabComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly queriesService = inject(QueriesService);
	private readonly dataTugNavContextService = inject(DatatugNavContextService);
	private readonly dataTugNavService = inject(DatatugNavService);

	@Input() rootFolder?: 'shared' | 'personal' | 'bookmarked';
	@Input() project?: IProjectContext;

	public isDeletingFolders: string[] = [];
	public type: QueryType | '*' = '*';

	public filter = '';

	public readonly codemirrorOptions = {
		lineNumbers: false,
		readOnly: true,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: { height: 'auto' },
	};

	public allQueries?: QueryItem[];

	public parentFolders: IParentFolder[] = [];

	public filteredItems?: FilteredItem[];

	private queriesSub?: Subscription;

	public currentFolder: IQueryFolderContext = { path: '~', id: '' };

	constructor() {
		console.log('QueriesPageComponent.constructor()');
		this.route.queryParamMap.subscribe({
			next: (queryParams) => {
				const id = queryParams.get('folder') || '';
				if (!id) {
					this.updateUrlWithCurrentFolder();
				} else {
					this.currentFolder = {
						path: (id && `~/${id}`) || '~',
						id,
					};
					this.displayCurrentFolder();
				}
			},
			error: this.errorLogger.logErrorHandler(
				'Failed to get query params map from activate route',
			),
		});
		this.loadQueries();
	}

	public isFiltering(): boolean {
		return !!this.filter && this.type !== '*';
	}

	getText(query: IQueryDef): string {
		return (query.request as ISqlQueryRequest).text;
	}

	public readonly trackById = (_: number, v: IProjItemBrief) => v.id;

	public clearFilter(): void {
		this.filter = '';
		this.type = '*';
	}

	public get isRoot(): boolean {
		return !!this.currentFolder.id;
	}

	goQuery(q: IQueryDef, action?: 'execute' | 'edit', folders?: string[]): void {
		console.log('goQuery', q, folders, this.currentFolder.path);
		const id = folders?.join('/').replace('~/', '');
		q = { ...q, id: `${id}/${q.id}` };
		if (this.project) {
			this.dataTugNavService.goQuery(this.project, q, action);
		}
	}

	applyFilter(): void {
		if (!this.filter) {
			this.filteredItems = undefined;
		}
		this.filteredItems = [];
		this.populateFilteredItems(
			this.currentFolder.path.split('/'),
			this.currentFolder,
		);
	}

	setQueryType(type: QueryType): void {
		this.type = type === this.type ? '*' : type;
		this.applyFilter();
	}

	private populateFilteredItems(path: string[], folder: IQueryFolder): void {
		const f = this.filter.toLowerCase();
		folder?.items?.forEach((item) => {
			if ((item.title || item.id).toLowerCase().includes(f)) {
				this.filteredItems?.push({ query: item, folders: path });
			}
		});
		folder?.folders?.forEach((subFolder) => {
			this.populateFilteredItems([...path, subFolder.id], subFolder);
		});
	}

	cd(path: string): void {
		console.log('cd()', path);
		if (path === '~') {
			this.currentFolder = {
				...this.parentFolders[0],
				path: '~',
			};
			this.parentFolders = [];
		} else if (path === '..') {
			const p = this.currentFolder.path.split('/');
			p.pop();
			const parentFolder: IParentFolder | undefined = this.parentFolders.pop();
			if (parentFolder) {
				this.currentFolder = {
					...parentFolder,
					path: p.join('/'),
				};
			}
		} else if (path) {
			this.currentFolder = {
				...this.getFolderAndUpdateParents(path, this.currentFolder),
				path: this.currentFolder.path + '/' + path,
			};
		} else if (!path) {
			throw new Error('can not change directory to a folder with empty name');
		}
		this.updateUrlWithCurrentFolder();
		this.displayCurrentFolder();
	}

	private updateUrlWithCurrentFolder(): void {
		this.setUrlParam('folder', this.currentFolder.path.replace('~/', ''));
	}

	private setUrlParam(name: string, value: string): void {
		this.router
			.navigate([], {
				queryParams: { [name]: value },
				replaceUrl: true,
			})
			.catch(
				this.errorLogger.logErrorHandler(
					`Failed to set url parameter "${name}"`,
				),
			);
	}

	private loadQueries(): void {
		console.log('QueriesPage.loadQueries()');
		this.dataTugNavContextService.currentProject.subscribe({
			next: (currentProject) => {
				console.log(
					'QueryPage.constructor() => currentProject:',
					currentProject,
				);
				this.project = currentProject;
				if (!currentProject) {
					return;
				}
				if (this.queriesSub) {
					this.queriesSub.unsubscribe();
				}
				console.log(
					'QueriesPage.constructor() => currentProject:',
					currentProject,
				);
				const { path } = this.currentFolder;
				this.queriesSub = this.queriesService
					.getQueriesFolder(currentProject.ref, path)
					.subscribe({
						next: (folder: IQueryFolder | null | undefined) => {
							this.onFolderRetrieved(path, folder);
						},
						error: this.errorLogger.logErrorHandler('Failed to load queries'),
					});
			},
			error: this.errorLogger.logErrorHandler('failed to get current project'),
		});
	}

	private onFolderRetrieved(path: string, folder?: IQueryFolder | null): void {
		console.log('onFolderRetrieved()', path, folder);
		if (!path) {
			throw new Error('path is a required parameter');
		}
		if (!folder) {
			throw new Error('folder argument expected to have value or be null');
		}
		if (path !== this.currentFolder.path) {
			return;
		}
		if (!folder && path === '~') {
			folder = { id: '~', folders: [], items: [] };
		}
		this.allQueries = folder?.items || [];
		if (folder) {
			this.currentFolder = {
				...this.getFolderAndUpdateParents(path, folder),
				path,
			};
		}
		this.displayCurrentFolder();
	}

	private getFolderAndUpdateParents(
		path: string,
		folder: IQueryFolder,
	): IQueryFolder {
		console.log('getFolder()', path, folder);
		if (path === '~') {
			return folder;
		}
		const p = path.split('/').reverse();
		while (folder && p.length) {
			const id = p.pop();
			// if (id === '~' && !p.length) {
			// 	continue;
			// }
			this.parentFolders.push({ ...folder, path: p.join('/') });
			folder = folder.folders?.find((item) => item.id === id) as IQueryFolder;
		}
		return folder;
	}

	private displayCurrentFolder(): void {
		this.currentFolder?.folders?.sort((a, b) => {
			if (a.id < b.id) {
				return -1;
			}
			if (a.id > b.id) {
				return 1;
			}
			return 0;
		});
		this.currentFolder?.items?.sort((a, b) => {
			const ac = a.title || a.id,
				bc = b.title || b.id;
			if (ac < bc) {
				return -1;
			}
			if (ac > bc) {
				return 1;
			}
			return 0;
		});
		this.applyFilter();
	}

	newFolder(): void {
		const name = prompt('Name of a new folder?');
		if (!name) {
			return;
		}
		const parentFolder = this.currentFolder;
		if (parentFolder && this.project) {
			this.queriesService
				.createQueryFolder(this.project.ref, parentFolder.path, name)
				.subscribe({
					next: (folder) => {
						const existing = parentFolder.folders?.find((f) => f.id === name);
						if (existing) {
							existing.folders = folder.folders;
							existing.items = folder.items;
						} else {
							if (parentFolder.folders) {
								// This smells, should use readonly props?
								parentFolder.folders.push(folder);
							} else {
								parentFolder.folders = [folder];
							}
						}
						this.cd(`${parentFolder.path}/${name}`);
					},
					error: this.errorLogger.logErrorHandler(
						'Failed to create new folder',
					),
				});
		}
	}

	public deleteFolder(): void {
		const m =
			this.currentFolder.path === '~'
				? 'Are you sure you want to delete all queries and sub-folder?'
				: `Are you sure you want to delete this folder?\n\n  /${this.currentFolder.path}`;
		if (!confirm(m)) {
			return;
		}
		const folder = this.currentFolder;
		const folderPath = folder.path;
		const parent = this.parentFolders[this.parentFolders.length - 1];
		this.isDeletingFolders.push(folderPath);
		if (this.project) {
			this.queriesService
				.deleteQueryFolder(this.project.ref, folderPath)
				.subscribe({
					next: () => {
						this.isDeletingFolders = this.isDeletingFolders.filter(
							(f) => f !== folderPath,
						);
						parent.folders = parent.folders?.filter((f) => f.id !== folder.id);
						if (
							this.currentFolder.path === folderPath &&
							this.currentFolder.id === folder.id
						) {
							this.cd('..');
						}
					},
					error: (err) => {
						this.isDeletingFolders = this.isDeletingFolders.filter(
							(f) => f !== folderPath,
						);
						this.errorLogger.logError(err, 'Failed to delete queries folder');
					},
				});
		}
	}
}
