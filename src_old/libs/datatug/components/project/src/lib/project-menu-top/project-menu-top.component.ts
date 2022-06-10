import { Component, Inject, OnDestroy } from '@angular/core';
import { DatatugNavContextService, DatatugNavService, ProjectTopLevelPage } from '@sneat/datatug/services/nav';
import { IProjectSummary } from '@sneat/datatug/models';
import { Observable, Subject } from 'rxjs';
import { IProjectContext } from '@sneat/datatug/nav';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { takeUntil } from 'rxjs/operators';
import { DatatugUserService } from '@sneat/datatug/services/base';

interface IProjectTopLevelPage {
	path: ProjectTopLevelPage | '';
	title: string;
	icon: string;
	count?: (proj: IProjectSummary) => number;
	buttons?: { path: ProjectTopLevelPage; icon: string }[];
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
			count: (proj) => proj?.boards?.length,
		},
		{
			path: 'dbmodels',
			title: 'DB models',
			icon: 'layers-outline',
			count: (proj) => proj?.dbModels?.length,
		},
		{
			path: 'entities',
			title: 'Entities',
			icon: 'book-outline',
			count: (proj) => proj?.entities?.length,
		},
		{
			path: 'environments',
			title: 'Environments',
			icon: 'earth-outline',
			count: (proj) => proj?.environments?.length,
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
			buttons: [{ path: 'query', icon: 'add' }],
		},
		{
			path: 'tags',
			title: 'Tags',
			icon: 'pricetags-outline',
			count: (proj) => proj?.tags?.length,
		},
		{
			path: 'widgets',
			title: 'Widgets',
			icon: 'easel-outline',
		},
	];

	project?: IProjectContext;
	public currentFolder: Observable<string>;

	private destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly nav: DatatugNavService,
		private readonly userService: DatatugUserService,
	) {
		this.datatugNavContextService.currentProject
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: this.setProject,
				error: this.errorLogger.logErrorHandler(
					'ProjectMenuTopComponent failed to retrieve project context from ProjectTracker',
				),
			});
		this.currentFolder = datatugNavContextService.currentFolder;
	}

	private setProject = (project: IProjectContext) => {
		console.log('ProjectMenuTopComponent.setProject()', project);
		this.project = project;
	};

	ngOnDestroy() {
		this.destroyed.next();
		this.destroyed.complete();
	}

	goProjPage(event: Event, page: ProjectTopLevelPage): boolean {
		console.log('goProjPage', page);
		event.preventDefault();
		event.stopPropagation();
		const project = this.project;
		this.nav.goProjPage(project, page, { project });
		return false;
	}
}
