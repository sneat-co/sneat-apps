import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  allUserProjectsAsFlatList,
  IDatatugProjectBriefWithIdAndStoreRef,
  IProjectAndStore,
} from '../../../models/interfaces';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import {
  DatatugUserService,
  IDatatugUserState,
} from '../../../services/base/datatug-user-service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';
import { STORE_TYPE_GITHUB } from '@sneat/core';
import { NewProjectService } from '../../../project/new-project/new-project.service';
import { DatatugNavService } from '../../../services/nav/datatug-nav.service';
import { IProjectContext } from '../../../nav/nav-models';
import { LoadingItemsComponent } from '../loading-items-component';

@Component({
  selector: 'sneat-datatug-my-projects',
  templateUrl: './my-datatug-projects.component.html',
  imports: [
    LoadingItemsComponent,
    IonCard,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    RouterLink,
    IonIcon,
    IonItemDivider,
  ],
})
export class MyDatatugProjectsComponent implements OnInit, OnDestroy {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navService = inject(DatatugNavService);
  private readonly sneatAuthStateService = inject(SneatAuthStateService);
  private readonly datatugUserService = inject(DatatugUserService);
  private readonly newProjectService = inject(NewProjectService);

  @Input() title?: string;

  public datatugUserState?: IDatatugUserState;
  public userRecordLoaded = false;

  public authState?: ISneatAuthState;

  private readonly destroyed = new Subject<void>();
  public projects?: IProjectAndStore[];
  public demoProjects: IDatatugProjectBriefWithIdAndStoreRef[] = [
    {
      id: 'datatug-demo-project@datatug',
      access: 'public',
      store: { ref: { type: STORE_TYPE_GITHUB, id: 'github.com' } },
      title: 'DataTug Demo Project @ GitHub',
    },
  ];

  public showDemoProjects = true;

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  ngOnInit(): void {
    this.datatugUserService.datatugUserState
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: (datatugUserState) => {
          // console.log('MyDatatugProjectsComponent.ngOnInit() => datatugUserState:', datatugUserState);
          this.authState = datatugUserState;
          this.userRecordLoaded =
            !!datatugUserState?.record || datatugUserState.record === null;
          const { record } = datatugUserState;
          if (record || record == null) {
            this.projects = allUserProjectsAsFlatList(record?.datatug?.stores);
          }
        },
        error: this.errorLogger.logErrorHandler(
          'Failed to get datatug user state',
        ),
      });
  }

  goDemoProject(project: IDatatugProjectBriefWithIdAndStoreRef): void {
    const projectContext: IProjectContext = {
      ref: { projectId: project.id, storeId: project.store.ref.type },
      brief: project,
      store: project.store,
    };
    this.navService.goProject(projectContext);
  }

  goProject(project: IProjectAndStore): void {
    console.log('goProject()', project);

    const projectContext: IProjectContext = {
      ref: project.ref,
      brief: project.project,
      store: { ref: project.store, brief: project.store },
    };
    this.navService.goProject(projectContext);
  }

  addProject(event: Event): void {
    this.newProjectService.openNewProjectDialog(event);
  }
}
