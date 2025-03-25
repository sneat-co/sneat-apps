import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	IDatatugProjectBriefWithId,
	IDatatugUser,
	projectsBriefFromDictToFlatList,
} from '@sneat/ext-datatug-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	DatatugNavContextService,
	DatatugNavService,
} from '@sneat/ext-datatug-services-nav';
import { NewProjectService } from '@sneat/ext-datatug-project';
import { IProjectContext } from '@sneat/ext-datatug-nav';
import { parseStoreRef } from '@sneat/core';

@Component({
	selector: 'sneat-datatug-menu-project-selector',
	templateUrl: 'menu-project-selector.component.html',
})
export class MenuProjectSelectorComponent implements OnChanges {
	@Input() datatugUser?: IDatatugUser;
	currentStoreId?: string;
	currentProjectId?: string;
	currentProject?: IProjectContext;
	project?: IProjectContext; // TODO(not_sure): should it be not input and take value from context?

	@Output() projectChanged = new EventEmitter<IProjectContext>();

	projects?: IDatatugProjectBriefWithId[];

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly newProjectService: NewProjectService,
		private readonly nav: DatatugNavService,
		private readonly datatugNavContextService: DatatugNavContextService,
	) {
		datatugNavContextService.currentStoreId.subscribe({
			next: (storeId) => (this.currentStoreId = storeId),
			error: this.errorLogger.logErrorHandler('Failed to retrieve store id'),
		});
		datatugNavContextService.currentProject.subscribe({
			next: this.setProject,
			error: this.errorLogger.logErrorHandler(
				'Failed to retrieve project context',
			),
		});
	}

	private setProject = (project: IProjectContext): void => {
		console.log('MenuProjectSelectorComponent.setProject()', project);
		this.project = project;
		this.currentProjectId = project?.ref?.projectId;
	};

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.datatugUser) {
			if (this.datatugUser?.datatug?.stores && this.currentStoreId) {
				const projectsById =
					this.datatugUser?.datatug?.stores[this.currentStoreId]?.projects;
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
			const brief = this.projects?.find((p) => p.id === projectId);
			if (!brief) {
				return;
			}
			const storeId = this.currentStoreId;
			this.currentProject = {
				ref: { projectId, storeId },
				brief,
				store: { ref: parseStoreRef(storeId) },
			};
			this.datatugNavContextService.setCurrentProject(this.currentProject);
			if (projectId) {
				this.nav.goProject(this.currentProject);
			}
			this.projectChanged.emit(this.currentProject);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle project switch');
		}
	}
}
