import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { parseStoreRef } from '@sneat/core';
import { IProjectContext } from '../nav/nav-models';
import { NewProjectService } from '../project/new-project/new-project.service';
import { DatatugNavContextService } from '../services/nav/datatug-nav-context.service';
import { DatatugNavService } from '../services/nav/datatug-nav.service';
import {
  IDatatugProjectBriefWithId,
  IDatatugUser,
  projectsBriefFromDictToFlatList,
} from '../models/interfaces';

@Component({
  selector: 'sneat-datatug-menu-project-selector',
  templateUrl: 'menu-project-selector.component.html',
})
export class MenuProjectSelectorComponent implements OnChanges {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly newProjectService = inject(NewProjectService);
  private readonly nav = inject(DatatugNavService);
  private readonly datatugNavContextService = inject(DatatugNavContextService);

  @Input() datatugUser?: IDatatugUser;
  currentStoreId?: string;
  currentProjectId?: string;
  currentProject?: IProjectContext;
  project?: IProjectContext; // TODO(not_sure): should it be not input and take value from context?

  @Output() projectChanged = new EventEmitter<IProjectContext>();

  projects?: IDatatugProjectBriefWithId[];

  constructor() {
    const datatugNavContextService = this.datatugNavContextService;

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
// console.log('MenuProjectSelectorComponent.setProject()', project);
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
// console.log('DatatugMenuComponent.switchProject', projectId);
      if (!this.currentStoreId) {
// console.log('project changed but there is no store');
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
