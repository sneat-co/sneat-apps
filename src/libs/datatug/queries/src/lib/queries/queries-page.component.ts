import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {IProjItemBrief, IQueryDef, IQueryFolder, QueryItem} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ViewDidEnter, ViewDidLeave, ViewWillEnter} from "@ionic/angular";
import {getStoreId, IProjectContext} from "@sneat/datatug/nav";
import {QueriesService} from "../queries.service";

interface FilteredItem {
	folders: string[];
	query: IQueryDef;
}

interface IParentFolder extends IQueryFolder {
	path: string;
}

type QueryType = 'SQL' | 'GraphQL' | 'HTTP' | '*'

@Component({
	selector: 'datatug-sql-queries',
	templateUrl: './queries-page.component.html',
	styleUrls: ['./queries-page.component.scss'],
})
export class QueriesPageComponent implements OnInit, ViewWillEnter, ViewDidEnter, ViewDidLeave {

	@ViewChild('codemirrorComponent', {static: true}) public codemirrorComponent: CodemirrorComponent;

	// noinspection SqlDialectInspection
	public sql = 'select * from ';

	public tab: 'shared' | 'new' | 'popular' | 'recent' | 'bookmarked' = 'shared'
	public type: QueryType = '*';

	public filter = '';

	public readonly trackById = (_, v: IProjItemBrief) => v.id;

	public get defaultBackHref(): string {
		return this.project ? `/store/${getStoreId(this.project.ref.storeId)}/project/${this.project.ref.projectId}` : '/';
	}

	public project: IProjectContext;
	public isDeletingFolders: string[] = [];


	public readonly codemirrorOptions = {
		lineNumbers: false,
		readOnly: true,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: {height: 'auto'},
	};

	public folderPath: string;

	public allQueries: QueryItem[];
	public currentFolder: IQueryFolder;
	public parentFolders: IParentFolder[] = [];

	public filteredItems: FilteredItem[];

	private queriesSub: Subscription;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly queriesService: QueriesService,
		private readonly dataTugNavContextService: DatatugNavContextService,
		private readonly dataTugNavService: DatatugNavService,
	) {
		console.log('QueriesPageComponent.constructor()');
		this.route.queryParamMap.subscribe({
			next: queryParams => {
				this.folderPath = queryParams.get('folder');
				this.displayCurrentFolder();
			},
			error: this.errorLogger.logErrorHandler('Failed to get query params map from activate route'),
		})
		this.loadQueries();
	}

	public isActiveView: boolean;

	ionViewWillEnter(): void {
		console.log('ionViewWillEnter()')
		this.isActiveView = true;
	}

	ionViewDidEnter(): void {
		console.log('ionViewDidEnter()')
	}

	ionViewDidLeave(): void {
		console.log('ionViewDidLeave()')
		this.isActiveView = false;
	}

	ngOnInit(): void {
		console.log('QueriesPage.ngOnInit()')
	}

	goQuery(q: IQueryDef, action?: 'execute' | 'edit', folders?: string[]): void {
		console.log('goQuery', q, folders, this.folderPath);
		const folderPath = folders?.length ? folders.join('/') : this.folderPath ?? '';

		if (folderPath) {
			q = {...q, id: folderPath + '/' +q.id};
		}
		this.dataTugNavService.goQuery(this.project, q, action);
	}

	reloadQueries(): void {
		this.loadQueries();
	}

	applyFilter(): void {
		if (!this.filter) {
			this.filteredItems = undefined;
		}
		this.filteredItems = [];
		this.populateFilteredItems(this.folderPath ? this.folderPath.split('/') : [], this.currentFolder);
	}

	setQueryType(type: QueryType): void {
		this.type = type === this.type ? '*' : type;
		this.applyFilter();
	}

	private populateFilteredItems(path: string[], folder: IQueryFolder): void {
		const f = this.filter.toLowerCase();
		folder?.items?.forEach(item => {
			if ((item.title || item.id).toLowerCase().indexOf(f) >= 0) {
				this.filteredItems.push({query: item, folders: path})
			}
		})
		folder?.folders?.forEach(subFolder => {
			this.populateFilteredItems([...path, subFolder.id], subFolder);
		});
	}

	cd(path: string): void {
		console.log('cd()', path);
		if (!path) {
			this.currentFolder = this.parentFolders[0];
			this.parentFolders = [];
			this.folderPath = '';
		} else if (path === '..') {
			const p = this.folderPath.split('/');
			p.pop()
			this.folderPath = p.join('/');
			this.currentFolder = this.parentFolders.pop()
		} else {
			this.folderPath = this.folderPath ? this.folderPath + '/' + path : path;
			this.currentFolder = this.getFolderAndUpdateParents(path, this.currentFolder);
		}
		this.router.navigate([],
			{
				queryParams: this.folderPath && {folder: this.folderPath},
				replaceUrl: true,
			})
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to another folder'));
		this.displayCurrentFolder();
	}

	private loadQueries(): void {
		console.log('QueriesPage.loadQueries()')
		this.dataTugNavContextService.currentProject.subscribe({
			next: currentProject => {
				console.log('QueryPage.constructor() => currentProject:', currentProject);
				this.project = currentProject;
				if (!currentProject) {
					return;
				}
				if (this.queriesSub) {
					this.queriesSub.unsubscribe();
				}
				console.log('QueriesPage.constructor() => currentProject:', currentProject);
				this.queriesSub = this.queriesService.getQueriesFolder(currentProject.ref, '').subscribe({
					next: folder => {
						this.allQueries = folder.items;
						this.currentFolder = this.getFolderAndUpdateParents(this.folderPath, folder)
						this.displayCurrentFolder();
					},
					error: this.errorLogger.logErrorHandler('Failed to load queries'),
				});
			},
			error: this.errorLogger.logErrorHandler('failed to get current project'),
		});
	}

	private getFolderAndUpdateParents(path: string, folder: IQueryFolder): IQueryFolder {
		console.log('getFolder()', path, folder);
		if (!path) {
			return folder;
		}
		const p = path.split('/').reverse();
		while (folder && p.length) {
			const id = p.pop();
			this.parentFolders.push({...folder, path: p.join('/')});
			folder = folder.folders.find(item => item.id === id) as IQueryFolder;
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
			const ac = a.title || a.id, bc = b.title || b.id;
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
		this.queriesService.createQueryFolder(this.project.ref, this.folderPath, name).subscribe({
			next: folder => {
				const existing = parentFolder.folders.find(f => f.id === name);
				if (existing) {
					existing.folders = folder.folders;
					existing.items = folder.items;
				} else {
					parentFolder.folders.push(folder);
				}
				this.cd(this.folderPath ? this.folderPath + '/' + name : name);
			},
			error: this.errorLogger.logErrorHandler('Failed to create new folder'),
		});
	}

	public deleteFolder(): void {
		if (!this.folderPath) {
			alert('The root folder is non deletable');
			return
		}
		if (!confirm(`Are you sure you want to delete this folder?\n\n  /${this.folderPath}`)) {
			return;
		}
		const folder = this.currentFolder;
		const folderPath = this.folderPath;
		const parent = this.parentFolders[this.parentFolders.length - 1];
		this.isDeletingFolders.push(folderPath)
		this.queriesService.deleteQueryFolder(this.project.ref, this.folderPath).subscribe({
			next: () => {
				this.isDeletingFolders = this.isDeletingFolders.filter(f => f !== folderPath);
				parent.folders = parent.folders.filter(f => f.id !== folder.id);
				if (this.folderPath === folderPath && this.currentFolder.id === folder.id) {
					this.cd('..');
				}
			},
			error: err => {
				this.isDeletingFolders = this.isDeletingFolders.filter(f => f !== folderPath);
				this.errorLogger.logError(err, 'Failed to delete queries folder')
			},
		})
	}
}
