import {Component, Inject, OnDestroy} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {Observable, Subject, Subscription} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {NavController} from '@ionic/angular';
import firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {IDatatugProjectBase, IDatatugProjectSummary, IDatatugUser} from '@sneat/datatug/models';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ProjectService} from '@sneat/datatug/services/project';
import {CLOUD_REPO} from '@sneat/datatug/core';
import {RepoService} from '@sneat/datatug/services/repo';
import {IDatatugProjectContext, IEnvDbTableContext} from '@sneat/datatug/nav';
import {DatatugUserService} from "@sneat/datatug/services/base";
import {AuthStates, SneatAuthStateService} from "@sneat/auth";


@Component({
	selector: 'datatug-menu',
	templateUrl: './datatug-menu.component.html',
	styleUrls: ['./datatug-menu.component.scss'],
})
export class DatatugMenuComponent implements OnDestroy {

	public authState: AuthStates;
	public currentRepoId: string;
	public currentProjectId: string;
	public currentDbModelId: string;
	public currentEnvId: string;
	public currentDbInstanceId: string;
	public currentProject: IDatatugProjectSummary;
	public projects: IDatatugProjectBase[] = [];

	public table: IEnvDbTableContext;
	public currentFolder: Observable<string>;
	public readonly firebaseUser$: Observable<firebase.User | null>
	private projSub: Subscription;
	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly sneatAuthStateService: SneatAuthStateService,
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly navCtrl: NavController,
		private readonly nav: DatatugNavService,
		private readonly repoService: RepoService,
		private readonly projectService: ProjectService,
		private readonly afAuth: AngularFireAuth,
		private readonly datatugUserService: DatatugUserService,
	) {
		console.log('DatatugMenuComponent.constructor()');
		this.firebaseUser$ = afAuth.user;
		// userService.userRecord.subscribe(user => {
		// 	this.projects = user?.data?.dataTugProjects;
		// });
		this.currentFolder = datatugNavContextService.currentFolder;
		try {
			this.trackAuthState();
			this.trackCurrentUser();
			this.trackCurrentRepo();
			this.trackCurrentProject();
			this.trackCurrentEnvironment();
			this.trackCurrentEnvDbTable();
		} catch (e) {
			errorLogger.logError(e, 'Failed to setup context tracking');
		}
	}

	public get currentProjUrlId(): string {
		return `${this.currentProjectId}@${this.currentRepoId}`;
	}

	private trackAuthState(): void {
		this.sneatAuthStateService.authState
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: authState => this.authState = authState,
				error: this.errorLogger.logErrorHandler('failed to get auth stage'),
			})
	}

	ngOnDestroy(): void {
		if (this.destroyed) {
			this.destroyed.next();
			this.destroyed.complete();
		}
	}

	switchRepo(event: CustomEvent): void {
		try {
			const {value} = event.detail;
			if (value && !this.currentRepoId) {
				console.log('DatatugMenuComponent.switchRepo()', value);
				this.nav.goRepo(value);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle repo switch');
		}
	}

	switchProject(event: CustomEvent): void {
		try {
			const {value} = event.detail;
			if (value !== this.currentProjectId) {
				console.log('DatatugMenuComponent.switchProject', value);
				const project = this.projects.find(p => p.id === value);
				this.datatugNavContextService.setCurrentProject({
					repoId: this.currentRepoId,
					brief: {
						...project,
						store: {type: 'agent'},
					},
					projectId: project?.id
				});
				if (value) {
					this.nav.goProject(this.currentRepoId, value);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle project switch');
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
				this.nav.goEnvironment({
					repoId: this.currentRepoId,
					projectId: this.currentProjectId
				}, undefined, envId);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle environment switch');
		}
	}

	public clearEnv(): void { // Called from template
		try {
			this.datatugNavContextService.setCurrentEnvironment(undefined);
			this.nav.goProject(this.currentRepoId, this.currentProjectId);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to clear environment');
		}
	}

	public logout(): void {
		try {
			this.afAuth
				.signOut()
				.then(() => {
					this.navCtrl.navigateBack('/signed-out')
						.catch(this.errorLogger.logErrorHandler('Failed to navigate to signed out page'));
				})
				.catch(this.errorLogger.logErrorHandler('Failed to sign out'));
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to logout');
		}
	}

	public datatugUser: IDatatugUser;

	private trackCurrentUser(): void {
		try {
			this.datatugUserService.datatugUser.pipe(
				takeUntil(this.destroyed),
			).subscribe({
				next: datatugUser => {
					this.datatugUser = datatugUser;
					console.log('trackCurrentUser() => datatugUser:', datatugUser);
				},
				error: this.errorLogger.logErrorHandler('Failed to get user record for menu'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup tracking of current user');
		}
	}

	private trackCurrentRepo(): void {
		try {
			this.datatugNavContextService.currentRepoId
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: this.onCurrentRepoChanged,
					error: err => this.errorLogger.logError(err, 'Failed to get repoId'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup tracking of current repository');
		}
	}

	private readonly onCurrentRepoChanged = (repoId: string): void => {
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
	}

	private trackCurrentProject(): void {
		try {
			this.datatugNavContextService.currentProject
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: this.onCurrentProjectChanged,
					error: err => this.errorLogger.logError(err, 'Failed to get current project'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup tracking of current project');
		}
	}

	private readonly onCurrentProjectChanged = (currentProject: IDatatugProjectContext): void => {
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
			console.log('DatatugMenuComponent: project =>', currentProject);
		} catch (ex) {
			this.errorLogger.logError(ex, 'Failed to process project brief');
		}
	}

	private trackCurrentEnvironment(): void {
		this.datatugNavContextService.currentEnv
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: env => this.currentEnvId = env?.id,
				error: err => this.errorLogger.logError(err, 'Failed to process changed environment'),
			})
	}

	private trackCurrentEnvDbTable(): void {
		this.datatugNavContextService.currentEnvDbTable
			.pipe(
				takeUntil(this.destroyed),
			)
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
