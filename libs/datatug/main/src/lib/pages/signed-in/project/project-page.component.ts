import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WormholeModule } from '@sneat/wormhole';
import { race, Subject } from 'rxjs';
import { skip, takeUntil } from 'rxjs/operators';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  NavController,
  ViewDidLeave,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { parseStoreRef } from '@sneat/core';
import { DatatugCoreModule } from '../../../core/datatug-core.module';
import { IProjectRef } from '../../../core/project-context';
import { DatatugFolderComponent } from '../../../folders/ui/datatug-folder.component';
import {
  IProjBoard,
  IProjDbModelBrief,
  IProjectSummary,
  IProjEntity,
  IProjEnv,
  IProjItemBrief,
  ProjectItem,
  ProjectItemType,
} from '../../../models/definition/project';
import { IProjectContext } from '../../../nav/nav-models';
import { ProjectTracker } from '../../../services/nav/contexts/project.tracker';
import { DatatugNavContextService } from '../../../services/nav/datatug-nav-context.service';
import {
  DatatugNavService,
  ProjectTopLevelPage,
} from '../../../services/nav/datatug-nav.service';
import { DatatugServicesNavModule } from '../../../services/nav/datatug-services-nav.module';
import { DatatugServicesProjectModule } from '../../../services/project/datatug-services-project.module';
import { ProjectService } from '../../../services/project/project.service';
import { DatatugServicesStoreModule } from '../../../services/repo/datatug-services-store.module';
import { DatatugServicesUnsortedModule } from '../../../services/unsorted/datatug-services-unsorted.module';
import { EntityService } from '../../../services/unsorted/entity.service';
import { EnvironmentService } from '../../../services/unsorted/environment.service';
import { SchemaService } from '../../../services/unsorted/schema.service';

@Component({
  selector: 'sneat-datatug-project',
  templateUrl: './project-page.component.html',
  imports: [
    FormsModule,
    DatatugCoreModule,
    DatatugServicesNavModule,
    DatatugServicesProjectModule,
    DatatugServicesStoreModule,
    DatatugServicesUnsortedModule,
    WormholeModule,
    DatatugFolderComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  ],
})
export class ProjectPageComponent
  implements OnDestroy, ViewWillEnter, ViewDidLeave
{
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly route = inject(ActivatedRoute);
  private readonly datatugNavService = inject(DatatugNavService);
  private readonly datatugNavContextService = inject(DatatugNavContextService);
  private readonly projectService = inject(ProjectService);
  private readonly schemaService = inject(SchemaService);
  private readonly environmentService = inject(EnvironmentService);
  private readonly entityService = inject(EntityService);
  private readonly navController = inject(NavController);

  // readonly DbModel = ProjectItem.dbModel as const;

  protected project?: IProjectContext;

  protected destroyed = new Subject<boolean>();
  @ViewChild(IonInput, { static: false }) addInput?: IonInput;

  protected isActiveView = false;

  private readonly projectTracker: ProjectTracker;

  constructor() {
    const route = this.route;
    console.log(
      'ProjectPageComponent.constructor()',
      route?.snapshot?.paramMap,
    );
    this.projectTracker = new ProjectTracker(this.destroyed, route);
    this.projectTracker.projectRef.subscribe({
      next: this.setProjRef,
      error: this.errorLogger.logErrorHandler(
        'Failed to get project ref for ProjectPageComponent',
      ),
    });
  }

  private setProjRef = (ref: IProjectRef) => {
    try {
      if (ref.projectId === this.project?.ref?.projectId) {
        this.project = { ref, store: { ref: parseStoreRef(ref.storeId) } };
      }
      this.projectService
        .watchProjectSummary(ref)
        .pipe(
          takeUntil(
            race([
              this.projectTracker.projectRef.pipe(skip(1)),
              this.destroyed,
            ]),
          ),
        )
        .subscribe({
          next: (summary) => this.onProjectSummaryChanged(ref, summary),
          error: this.errorLogger.logErrorHandler(
            'Failed to load project summary for project page',
          ),
        });
    } catch (e) {
      this.errorLogger.logError(
        e,
        'Failed to set projectRef at ProjectPageComponent',
      );
    }
  };

  ionViewWillEnter(): void {
    this.isActiveView = true;
  }

  ionViewDidLeave(): void {
    this.isActiveView = false;
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
    this.destroyed.complete();
  }

  // noinspection JSUnusedGlobalSymbols
  protected goDbModel(dbModelBrief: IProjDbModelBrief): void {
    this.goProjItemPage(ProjectItem.dbModel, dbModelBrief);
  }

  // public createEntity = (title: string) => {
  // 	return this.createProjItem(ProjectItem.Entity, title, this.entityService.createEntity);
  // }

  // noinspection JSUnusedGlobalSymbols
  protected goEnvironment(projEnv: IProjEnv): void {
    this.datatugNavService.goEnvironment(this.project, projEnv);
  }

  // noinspection JSUnusedGlobalSymbols
  protected goProjFolder(projItemType: ProjectItemType): void {
    if (!this.project?.ref?.projectId) {
      this.errorLogger.logError(
        new Error('Can not navigate to project folder'),
        '!this.projBrief.id',
      );
      return;
    }
    const url = `project/${this.project.ref.projectId}/${projItemType}s`;
    this.navController
      .navigateForward(url, {
        state: {
          project: this.project,
        },
      })
      .catch((err) =>
        this.errorLogger.logError(
          err,
          'Failed to navigate to project item page: ' + url,
        ),
      );
  }

  // noinspection JSUnusedGlobalSymbols
  protected goEntity(entity: IProjEntity): void {
    if (!this.project) {
      return;
    }
    this.datatugNavService.goEntity(this.project, entity);
  }

  // noinspection JSUnusedGlobalSymbols
  protected goBoard(board: IProjBoard): void {
    if (!this.project) {
      return;
    }
    this.datatugNavService.goBoard(this.project, board);
  }

  // noinspection JSUnusedGlobalSymbols
  protected getItemLink = (path: string) => (item: IProjItemBrief) =>
    `${path}/${item.id}`;

  // private onProjectIdChanged(): void {
  // 	console.log('ProjectPageComponent.onProjectIdChanged()', this.project.ref);
  // 	if (this.projectSubscription) {
  // 		this.projectSubscription.unsubscribe();
  // 	}
  // 	if (this.project?.ref) {
  // 		this.projectSubscription = this.projectService.watchProjectSummary(this.project.ref).pipe(
  // 			takeUntil(this.destroyed),
  // 		).subscribe({
  // 			next: projectSummary => this.onProjectSummaryChanged(this.project.ref, projectSummary),
  //
  // 		});
  // 	}
  // }

  private onProjectSummaryChanged(
    ref: IProjectRef,
    summary?: IProjectSummary,
  ): void {
    console.log(
      'ProjectPageComponent.onProjectSummaryChanged():',
      ref,
      summary,
    );
    if (!summary) {
      return;
    }
    this.project = {
      ...this.project,
      ref,
      brief: { access: summary.access, title: summary.title },
      summary,
    };
  }

  private goProjItemPage(
    page: ProjectItemType,
    _: IProjItemBrief,
  ): void {
    switch (page) {
      case ProjectItem.environment:
        page = 'env' as ProjectItemType;
        break;
    }
    this.datatugNavService.goProjPage(page, this.project, {
      projectContext: this.project,
    });
  }

  goTo(event: CustomEvent): void {
    const page = event.detail.value as ProjectTopLevelPage;
    this.datatugNavService.goProject(this.project, page);
  }
}
