import {AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {IQueryDef, IQueryFolder, QueryItem} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {QueriesService} from '@sneat/datatug/services/unsorted';
import {IProjectContext} from '@sneat/datatug/core';
import {DatatugMenuService, DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ViewDidEnter, ViewDidLeave} from "@ionic/angular";

interface FilteredItem {
	folders: string[];
	query: IQueryDef;
}

@Component({
	selector: 'datatug-sql-queries',
	templateUrl: './queries-page.component.html',
	styleUrls: ['./queries-page.component.scss'],
})
export class QueriesPageComponent implements OnInit, ViewDidEnter, ViewDidLeave {

	@ViewChild('codemirrorComponent', {static: true}) public codemirrorComponent: CodemirrorComponent;

	public sql = 'select * from';

	public tab: 'all' | 'new' | 'popular' | 'recent' | 'bookmarked' = 'all'
	public type: 'SQL' | 'GraphQL' | 'HTTP' | '*' = '*';

	public filter = '';

	public currentProject: IProjectContext;

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
	public parentFolders: IQueryFolder[] = [];

	public filteredItems: FilteredItem[];

	private queriesSub: Subscription;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly queriesService: QueriesService,
		private readonly dataTugNavContextService: DatatugNavContextService,
		private readonly dataTugNavService: DatatugNavService,
		private readonly datatugMenuService: DatatugMenuService,
	) {
		this.route.queryParamMap.subscribe({
			next: queryParams => {
				this.folderPath = queryParams.get('folder');
				this.displayCurrentFolder();
			},
			error: this.errorLogger.logErrorHandler('Failed to get query params map from activate route'),
		})
		this.loadQueries();
	}

	ngOnInit(): void {
		console.log('QueriesPage.ngOnInit()')
	}

	@ViewChild('contextMenu')
	contextMenu: TemplateRef<any>;


	ionViewDidEnter(): void {
		this.datatugMenuService.setContextMenu(this.contextMenu);
	}

	ionViewDidLeave(): void {
		this.datatugMenuService.removeContextMenu(this.contextMenu);
	}

	goQuery(query: IQueryDef, action?: 'execute' | 'edit'): void {
		const id = this.folderPath ? this.folderPath + '/' + query.id : query.id;
		this.dataTugNavService.goQuery(this.currentProject, query, id, action);
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

	private populateFilteredItems(path: string[], folder: IQueryFolder): void {
		const f = this.filter.toLowerCase();
		folder?.queries?.forEach(item => {
			if (item.type === 'folder') {
				this.populateFilteredItems([...path, item.id], item);
			} else {
				if ((item.title || item.id).toLowerCase().indexOf(f) >= 0) {
					this.filteredItems.push({query: item, folders: path})
				}
			}
		})
	}

	cd(path: string): void {
		console.log('cd()', path);
		if (path === '..') {
			const p = this.folderPath.split('/');
			p.pop()
			this.folderPath = p.join('/');
			this.currentFolder = this.parentFolders.pop()
		} else {
			this.folderPath = this.folderPath ? this.folderPath + '/' + path : path;
			this.currentFolder = this.getFolderAndUpdateParents(path, this.currentFolder);
		}
		this.router.navigate([], {queryParams: this.folderPath && {folder: this.folderPath}})
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to another folder'));
		this.displayCurrentFolder();
	}

	private loadQueries(): void {
		console.log('QueriesPage.loadQueries()')
		this.dataTugNavContextService.currentProject.subscribe({
			next: currentProject => {
				console.log('QueryPage.constructor() => currentProject:', currentProject);
				this.currentProject = currentProject;
				if (!currentProject) {
					return;
				}
				if (this.queriesSub) {
					this.queriesSub.unsubscribe();
				}
				console.log('QueriesPage.constructor() => currentProject:', currentProject);
				this.queriesSub = this.queriesService.getQueries(currentProject, '').subscribe({
					next: queries => {
						this.allQueries = queries;
						this.currentFolder = this.getFolderAndUpdateParents(this.folderPath, {
							id: '',
							type: 'folder',
							queries
						})
						this.displayCurrentFolder();
						console.log('QueriesPage.constructor() => queries:', queries);
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
			this.parentFolders.push(folder);
			folder = folder.queries.find(item => item.id === id && item.type === 'folder') as IQueryFolder;
		}
		return folder;
	}

	private displayCurrentFolder(): void {
		this.currentFolder?.queries?.sort((a, b) => {
			const ac = a.title || a.id, bc = b.title || b.id;
			if (a.type === 'folder' && b.type !== 'folder' || ac < bc) {
				return -1;
			}
			if (a.type !== 'folder' && b.type === 'folder' || ac > bc) {
				return 1;
			}
			return 0;
		});
		this.applyFilter();
	}

	public queryId = (_, query: IQueryDef) => query.id;
}
