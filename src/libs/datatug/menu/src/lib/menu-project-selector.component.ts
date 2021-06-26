import {Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {IDatatugProjectBriefWithId, IDatatugUser, projectsBriefFromDictToFlatList} from "@sneat/datatug/models";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {DatatugNavContextService, DatatugNavService, IProjectNavContext} from "@sneat/datatug/services/nav";
import {NewProjectService} from '@sneat/datatug/project';
import {IProjectBrief} from '@sneat/datatug/core';
import {IProjectContext} from '@sneat/datatug/nav';

@Component({
	selector: 'datatug-menu-project-selector',
	templateUrl: 'menu-project-selector.component.html'
})
export class MenuProjectSelectorComponent implements OnChanges {
	@Input() datatugUser?: IDatatugUser;
	@Input() currentStoreId?: string;
	@Input() project: IProjectContext; // TODO(not_sure): should it be not input and take value from context?

	@Output() projectChanged = new EventEmitter<IProjectContext>()

	projects?: IDatatugProjectBriefWithId[];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly newProjectService: NewProjectService,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.datatugUser) {
			if (this.datatugUser?.datatug?.stores && this.currentStoreId) {
				const projectsById = this.datatugUser?.datatug?.stores[this.currentStoreId]?.projects;
				this.projects = projectsBriefFromDictToFlatList(projectsById);
			} else {
				this.projects = undefined;
			}
		}
	}

	public newProject(event: Event): void {
		this.newProjectService.openNewProjectDialog(event);
	}

	switchProject(event: CustomEvent): void {
		try {
			const projectId: string = event.detail.value;
			if (!projectId) {
				return;
			}
			console.log('DatatugMenuComponent.switchProject', projectId);
			if (!this.currentStoreId) {
				console.log('project changed but there is no store');
				return;
			}
			const project = this.projects?.find(p => p.id === projectId);
			if (!project) {
				return;
			}
			this.datatugNavContextService.setCurrentProject({
				storeId: this.currentStoreId,
				brief: {
					...project,
					id: projectId,
					store: {type: 'agent'},
				},
				projectId,
			});
			if (projectId) {
				const projNavContext: IProjectNavContext = {
					id: projectId,
					store: {id: this.currentStoreId},
				};
				this.nav.goProject(projNavContext);
			}
			this.projectChanged.emit({projectId, storeId: this.currentStoreId})
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle project switch');
		}
	}

}
