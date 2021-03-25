import {Component, OnDestroy} from '@angular/core';
import {DatatugNavContextService, DatatugNavService, ProjectTopLevelPage} from "@sneat/datatug/services/nav";
import {IDatatugProjectSummary} from "@sneat/datatug/models";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

interface IProjectTopLevelPage {
	path: ProjectTopLevelPage | '';
	title: string;
	icon: string;
	count?: (proj: IDatatugProjectSummary) => number;
	buttons?: { path: ProjectTopLevelPage, icon: string; }[];
}

@Component({
	selector: 'datatug-project-menu-top',
	templateUrl: './project-menu-top.component.html',
})
export class ProjectMenuTopComponent implements OnDestroy {

	public readonly projTopLevelPages: IProjectTopLevelPage[] = [
		{
			path: '',
			title: 'Overview',
			icon: 'home-outline',
		},
		{
			path: 'boards',
			title: 'Boards',
			icon: 'easel-outline',
			count: proj => proj?.boards?.length,
		},
		{
			path: 'dbmodels',
			title: 'DB models',
			icon: 'layers-outline',
			count: proj => proj?.dbModels?.length,
		},
		{
			path: 'entities',
			title: 'Entities',
			icon: 'book-outline',
			count: proj => proj?.entities?.length,
		},
		{
			path: 'environments',
			title: 'Environments',
			icon: 'earth-outline',
			count: proj => proj?.environments?.length,
		},
		{
			path: 'servers',
			title: 'Servers',
			icon: 'server-outline',
		},
		{
			path: 'queries',
			title: 'Queries',
			icon: 'terminal-outline',
			buttons: [
				{path: 'query', icon: 'add'}
			]
		},
		{
			path: 'tags',
			title: 'Tags',
			icon: 'pricetags-outline',
			count: proj => proj?.tags?.length,
		},
		{
			path: 'widgets',
			title: 'Widgets',
			icon: 'easel-outline',
		},
	];

	currentRepoId: string;
	currentProjectId: string;
	currentProject: IDatatugProjectSummary;
	public currentFolder: Observable<string>;

	private destroyed = new Subject<void>();

	constructor(
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly nav: DatatugNavService,
	) {
		this.datatugNavContextService.currentRepoId.pipe(takeUntil(this.destroyed)).subscribe({
			next: id => this.currentRepoId = id,
		});
		this.datatugNavContextService.currentProject.pipe(takeUntil(this.destroyed)).subscribe({
			next: proj => this.currentProjectId = proj?.brief?.id,
		});
		this.currentFolder = datatugNavContextService.currentFolder;
	}

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	goProjPage(event: Event, page: ProjectTopLevelPage): boolean {
		console.log('goProjPage', page);
		event.preventDefault();
		event.stopPropagation();

		this.nav.goProjPage(this.currentRepoId, this.currentProjectId, page, {projSummary: this.currentProject});
		return false;
	}


}
