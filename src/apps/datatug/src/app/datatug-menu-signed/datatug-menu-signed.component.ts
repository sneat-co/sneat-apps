import {Component, Inject, OnDestroy} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {Observable, Subject, Subscription} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {NavController} from '@ionic/angular';
import firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {IProjectBase, IProjectSummary} from '@sneat/datatug/models';
import {
  DatatugNavContextService,
  DatatugNavService,
  ProjectTopLevelPage
} from '@sneat/datatug/services/nav';
import {ProjectService} from '@sneat/datatug/services/project';
import {CLOUD_REPO} from '@sneat/datatug/core';
import {RepoService} from '@sneat/datatug/services/repo';
import {IEnvDbTableContext} from '@sneat/datatug/nav';

interface IProjectTopLevelPage {
  path: ProjectTopLevelPage | '';
  title: string;
  icon: string;
  count?: (proj: IProjectSummary) => number;
  buttons?: {path: string, icon: string; }[];
}

@Component({
  selector: 'datatug-menu-signed',
  templateUrl: './datatug-menu-signed.component.html',
  styleUrls: ['./datatug-menu-signed.component.scss'],
})
export class DatatugMenuSignedComponent implements OnDestroy {

  public currentRepoId: string;
  public currentProjectId: string;
  public currentDbModelId: string;
  public currentEnvId: string;
  public currentDbInstanceId: string;
  public currentProject: IProjectSummary;
  public projects: IProjectBase[] = [];

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

  public readonly appPages = [
    {
      title: 'Databoards',
      url: '/databoards',
      icon: 'mail'
    },
    {
      title: 'Queries',
      url: '/folder/Queries',
      icon: 'mail'
    },
    {
      title: 'Databases',
      url: '/folder/databases',
      icon: 'mail'
    },
    {
      title: 'Environments',
      url: '/folder/environments',
      icon: 'mail'
    },
    {
      title: 'Agents',
      url: '/folder/repos',
      icon: 'mail'
    },
    {
      title: 'Widgets',
      url: '/folder/widgets',
      icon: 'mail'
    },
  ];
  public readonly labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public table: IEnvDbTableContext;
  public currentFolder: Observable<string>;
  public readonly firebaseUser$: Observable<firebase.User | null>
  private projSub: Subscription;
  private readonly destroyed = new Subject<void>();

  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
    private readonly datatugNavContextService: DatatugNavContextService,
    private readonly navCtrl: NavController,
    private readonly nav: DatatugNavService,
    private readonly repoService: RepoService,
    private readonly projectService: ProjectService,
    private readonly afAuth: AngularFireAuth,
    // private readonly userService: UserService,
  ) {
    this.firebaseUser$ = afAuth.user;
    console.log('DataTugMenuComponent.constructor()');
    // userService.userRecord.subscribe(user => {
    // 	this.projects = user?.data?.dataTugProjects;
    // });
    this.currentFolder = datatugNavContextService.currentFolder;
    this.trackCurrentAgent();
    this.trackCurrentProject();
    this.trackCurrentEnvironemnt();
    this.trackCurrentEnvDbTable();
  }

  public get currentProjUrlId(): string {
    return `${this.currentProjectId}@${this.currentRepoId}`;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  switchRepo(event: CustomEvent): void {
    const {value} = event.detail;
    if (value !== this.currentRepoId) {
      console.log('switchRepo', event);
      this.nav.goAgent(value);
    }
  }

  switchProject(event: CustomEvent): void {
    const {value} = event.detail;
    if (value !== this.currentProjectId) {
      console.log('switchProject', event);
      const project = this.projects.find(p => p.id === value);
      this.datatugNavContextService.setCurrentProject({
        repoId: this.currentRepoId,
        brief: {
          ...project,
          store: {type: 'agent'},
        },
        projectId: project?.id
      });
      this.nav.goProject(this.currentRepoId, value);
    }
  }

  switchEnv(event: CustomEvent): void {
    console.log('switchEnv', event);
    try {
      const envId = event.detail.value as string;
      if (envId !== this.currentEnvId) {
        console.log('switchEnv', event);
        // const env = this.currentProject.environments.find(e => e.id === value);
        this.datatugNavContextService.setCurrentEnvironment(envId);
        this.nav.goEnvironment({repoId: this.currentRepoId, projectId: this.currentProjectId}, undefined, envId);
      }
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to switch environment from app menu');
    }
  }

  clearEnv(): void {
    this.datatugNavContextService.setCurrentEnvironment(undefined);
    this.nav.goProject(this.currentRepoId, this.currentProjectId);
  }

  projectPageUrl(page: ProjectTopLevelPage | ''): string {
    return `/repo/${this.currentRepoId}/project/${this.currentProjectId}/${page}`;
  }

  goProjPage(event: Event, page: ProjectTopLevelPage): boolean {
    console.log('goProjPage', page);
    event.preventDefault();
    event.stopPropagation();

    this.nav.goProjPage(this.currentRepoId, this.currentProjectId, page, {projSummary: this.currentProject});
    return false;
  }

  public logout(): void {
    this.afAuth
      .signOut()
      .then(() => {
        this.navCtrl.navigateBack('/signed-out')
          .catch(this.errorLogger.logErrorHandler('Failed to navigate to signed out page'));
      })
      .catch(this.errorLogger.logErrorHandler('Failed to sign out'));
  }

  private trackCurrentAgent(): void {
    this.datatugNavContextService.currentRepoId
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: repoId => {
          if (repoId === this.currentRepoId) {
            return;
          }
          console.log('DatatugMenuComponent => repoId changed:', repoId, this.currentRepoId);
          this.currentRepoId = repoId;
          if (repoId) {
            this.repoService.getProjects(repoId)
              .pipe(
                takeUntil(this.destroyed),
                first(),
              )
              .subscribe({
                next: projects => {
                  this.projects = projects;
                },
                error: err => this.errorLogger.logError(err,
                  'Failed to get list of projects for an repo from menu component', {show: false}),
              });
          }
        },
        error: err => this.errorLogger.logError(err, 'Failed to get repoId'),
      });
  }

  private trackCurrentProject(): void {
    this.datatugNavContextService.currentProject
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: currentProject => {
          const {brief, summary, repoId} = currentProject || {};
          const {id} = brief || {};
          if (id !== this.currentProjectId) {
            console.log('DatatugMenuComponent => currentProjectId changed:', id, this.currentProjectId);
          }
          this.currentProjectId = id;
          this.currentProject = summary;
          try {
            if (repoId) {
              this.currentRepoId = repoId;
            }
            this.currentProjectId = id;
            if (!id) {
              this.currentProject = undefined;
              this.projSub?.unsubscribe();
              return;
            }
            if (id !== '.' && repoId === CLOUD_REPO) {
              this.projSub = this.projectService.watchProject(id).subscribe({
                next: project => {
                  this.currentProject = project;
                },
                error: this.errorLogger.logErrorHandler('Failed to watch project at Firestore: ' + id),
              });
            }
            console.log('DataTugMenuComponent: project =>', currentProject);
          } catch (ex) {
            this.errorLogger.logError(ex, 'Failed to process project brief');
          }
        },
        error: err => this.errorLogger.logError(err, 'Failed to get current project'),
      });
  }

  private trackCurrentEnvironemnt(): void {
    this.datatugNavContextService.currentEnv
      .pipe(
        takeUntil(this.destroyed),
      )
      .subscribe({
        next: env => {
          this.currentEnvId = env?.id;
        },
        error: err => this.errorLogger.logError(err, 'Failed to process changed environment'),
      })
  }

  private trackCurrentEnvDbTable(): void {
    this.datatugNavContextService.currentEnvDbTable
      .pipe(takeUntil(this.destroyed))
      .subscribe({
        next: table => {
          if (table?.name !== this.table?.name && table?.schema !== this.table?.schema) {
            console.log(`DatatugMenuComponent => currentTable changed to: ${table.schema}.${table.name}, meta:`, table.meta);
          }
          this.table = table;
        },
        error: err => this.errorLogger.logError(err, 'Failed to get current table context'),
      });
  }
}
