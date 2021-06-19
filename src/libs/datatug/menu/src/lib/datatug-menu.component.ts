import {Component, Inject, OnDestroy} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {Observable, Subject, Subscription} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {NavController} from '@ionic/angular';
import {IDatatugProjectBase, IDatatugProjectSummary, IDatatugUser} from '@sneat/datatug/models';
import {DatatugNavContextService, DatatugNavService} from '@sneat/datatug/services/nav';
import {ProjectService} from '@sneat/datatug/services/project';
import {CLOUD_REPO} from '@sneat/datatug/core';
import {DatatugStoreService} from '@sneat/datatug/services/repo';
import {IDatatugProjectContext, IEnvDbTableContext} from '@sneat/datatug/nav';
import {DatatugUserService, IDatatugUserState} from "@sneat/datatug/services/base";
import {AuthStatus, AuthStatuses, ISneatAuthState, SneatAuthStateService} from "@sneat/auth";


@Component({
	selector: 'datatug-menu',
	templateUrl: './datatug-menu.component.html',
	styleUrls: ['./datatug-menu.component.scss'],
})
export class DatatugMenuComponent implements OnDestroy {

	public authStatus?: AuthStatus;
	public currentStoreId?: string;
	public currentProjectId?: string;
	public currentDbModelId?: string;
	public currentEnvId?: string;
	public currentDbInstanceId?: string;
	public currentProject?: IDatatugProjectSummary;
	public projects: IDatatugProjectBase[] = [];

	public table?: IEnvDbTableContext;
	public currentFolder?: Observable<string>;
	public authState: ISneatAuthState = {status: AuthStatuses.authenticating};
	private projSub?: Subscription;
	private readonly destroyed = new Subject<void>();

	public datatugUserState?: IDatatugUserState;

	constructor(
		@Inject(ErrorLogger)
		private readonly errorLogger: IErrorLogger,
		private readonly navCtrl: NavController,
		private readonly sneatAuthStateService: SneatAuthStateService,
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly nav: DatatugNavService,
		private readonly storeService: DatatugStoreService,
		private readonly projectService: ProjectService,
		private readonly datatugUserService: DatatugUserService,
	) {
		console.log('DatatugMenuComponent.constructor()');
		this.sneatAuthStateService.authState
			.pipe(takeUntil(this.destroyed))
			.subscribe({
				next: authState => {
					this.authState = authState;
				},
				error: errorLogger.logErrorHandler('failed to process sneat auth state'),
			});

		// userService.userRecord.subscribe(user => {
		// 	this.projects = user?.data?.dataTugProjects;
		// });
		try {
			this.trackAuthState();
			this.trackCurrentUser();
			this.currentFolder = datatugNavContextService?.currentFolder;
			if (datatugNavContextService) {
				this.trackCurrentRepo();
				this.trackCurrentProject();
				this.trackCurrentEnvironment();
				this.trackCurrentEnvDbTable();
			} else {
				console.error('datatugNavContextService is not injected');
			}
		} catch (e) {
			errorLogger.logError(e, 'Failed to setup context tracking');
		}
	}

	public get currentProjUrlId(): string {
		return `${this.currentProjectId}@${this.currentStoreId}`;
	}

	private trackAuthState(): void {
		if (!this.sneatAuthStateService) {
			console.error('this.sneatAuthStateService is not injected');
			return;
		}
		this.sneatAuthStateService.authStatus
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: authState => this.authStatus = authState,
				error: this.errorLogger.logErrorHandler('failed to get auth stage'),
			})
	}

	ngOnDestroy(): void {
		if (this.destroyed) {
			this.destroyed.next();
			this.destroyed.complete();
		}
	}

	public logout(): void {
		try {
			this.sneatAuthStateService.signOut()
				.then(() => {
					this.navCtrl.navigateBack('/signed-out')
						.catch(this.errorLogger.logErrorHandler('Failed to navigate to signed out page'));
				})
				.catch(this.errorLogger.logErrorHandler('Failed to sign out'));
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to logout');
		}
	}

	private trackCurrentUser(): void {
		try {
			if (!this.datatugUserService) {
				console.error('this.datatugUserService is not injected');
				return;
			}
			this.datatugUserService.datatugUserState.pipe(
				takeUntil(this.destroyed),
			).subscribe({
				next: datatugUser => {
					this.datatugUserState = datatugUser;
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
			this.datatugNavContextService.currentStoreId
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: this.onCurrentStoreChanged,
					error: err => this.errorLogger.logError(err, 'Failed to get storeId'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup tracking of current repository');
		}
	}

	private readonly onCurrentStoreChanged = (storeId?: string): void => {
		if (storeId === this.currentStoreId) {
			return;
		}
		console.log('DatatugMenuComponent => storeId changed:', storeId, this.currentStoreId);
		this.currentStoreId = storeId;
		if (storeId) {
			this.storeService.getProjects(storeId)
				.pipe(
					takeUntil(this.destroyed),
					first(),
				)
				.subscribe({
					next: projects => {
						this.projects = projects;
					},
					error: err => this.errorLogger.logError(err,
						'Failed to get list of projects for a store from menu component', {show: false}),
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

	private readonly onCurrentProjectChanged = (currentProject?: IDatatugProjectContext): void => {
		const {brief, summary, storeId} = currentProject || {};
		const {id} = brief || {};
		if (id !== this.currentProjectId) {
			console.log('DatatugMenuComponent => currentProjectId changed:', id, this.currentProjectId);
		}
		this.currentProjectId = id;
		this.currentProject = summary;
		try {
			if (storeId) {
				this.currentStoreId = storeId;
			}
			this.currentProjectId = id;
			if (!id) {
				this.currentProject = undefined;
				this.projSub?.unsubscribe();
				return;
			}
			if (id !== '.' && storeId === CLOUD_REPO) {
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
					if (table) {
						if (table.name !== this.table?.name && table.schema !== this.table?.schema) {
							console.log(`DatatugMenuComponent => currentTable changed to: ${table.schema}.${table.name}, meta:`, table.meta);
						}
					}
					this.table = table;
				},
				error: err => this.errorLogger.logError(err, 'Failed to get current table context'),
			});
	}

}
