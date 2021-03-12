import {Component} from '@angular/core';
import {DatatugNavContextService, DatatugNavService, ProjectTopLevelPage} from "@sneat/datatug/services/nav";
import {IProjectSummary} from "@sneat/datatug/models";
import {Observable} from "rxjs";

interface IProjectTopLevelPage {
	path: ProjectTopLevelPage | '';
	title: string;
	icon: string;
	count?: (proj: IProjectSummary) => number;
	buttons?: { path: ProjectTopLevelPage, icon: string; }[];
}

@Component({
	selector: 'datatug-project-context-menu',
	templateUrl: './project-context-menu.component.html',
})
export class ProjectContextMenuComponent {

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
	currentProject: IProjectSummary;
	public currentFolder: Observable<string>;

	constructor(
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly nav: DatatugNavService,
	) {
		this.currentFolder = datatugNavContextService.currentFolder;
	}

	goProjPage(event: Event, page: ProjectTopLevelPage): boolean {
		console.log('goProjPage', page);
		event.preventDefault();
		event.stopPropagation();

		this.nav.goProjPage(this.currentRepoId, this.currentProjectId, page, {projSummary: this.currentProject});
		return false;
	}


}
