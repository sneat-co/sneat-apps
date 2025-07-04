import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonMenuButton,
	IonTitle,
	IonToolbar,
	ViewDidEnter,
	ViewDidLeave,
} from '@ionic/angular/standalone';
import { AuthStatus } from '@sneat/auth-core';
import { SneatErrorCardComponent } from '@sneat/components';
import { parseStoreRef } from '@sneat/core';
import {
	IProjectBase,
	// projectsBriefFromDictToFlatList,
} from '@sneat/ext-datatug-models';
import {
	DatatugNavService,
	StoreTracker,
} from '@sneat/ext-datatug-services-nav';
import {
	AgentStateService,
	DatatugStoreService,
	IAgentState,
} from '@sneat/ext-datatug-services-repo';
import { IDatatugStoreContext, IProjectContext } from '@sneat/ext-datatug-nav';
import { NewProjectService } from '@sneat/ext-datatug-project';
import { DatatugUserService } from '@sneat/ext-datatug-services-base';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
	selector: 'sneat-datatug-store-page',
	templateUrl: './datatug-store-page.component.html',
	imports: [
		SneatErrorCardComponent,
		RouterLink,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonMenuButton,
		IonBackButton,
		IonTitle,
		IonContent,
		IonCard,
		IonList,
		IonItemDivider,
		IonLabel,
		IonButton,
		IonIcon,
		IonItem,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
	],
})
export class DatatugStorePageComponent
	implements OnInit, OnDestroy, ViewDidLeave, ViewDidEnter
{
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly route = inject(ActivatedRoute);
	private readonly storeService = inject(DatatugStoreService);
	private readonly nav = inject(DatatugNavService);
	private readonly agentStateService = inject(AgentStateService);
	private readonly newProjectService = inject(NewProjectService);
	private readonly datatugUserService = inject(DatatugUserService);

	public storeId?: string | null;
	public projects?: IProjectBase[];
	public error: unknown;

	public agentState?: IAgentState;
	public isLoading?: boolean;

	private readonly destroyed = new Subject<void>();
	private readonly viewDidLeave = new Subject<void>();
	private readonly storeChanged = new Subject<void>();

	private readonly storeTracker: StoreTracker;

	protected authStatus?: AuthStatus;

	constructor() {
		const route = this.route;
		const datatugUserService = this.datatugUserService;

		console.log(
			'DatatugStorePageComponent.constructor(), window.history.state:',
			window.history.state,
		);
		const store = window.history.state.store as IDatatugStoreContext;
		if (store) {
			// this.storeId = store.id;
			// this.projects = projectsBriefFromDictToFlatList(store.brief.projects);
			throw new Error('Not implemented yet');
		}
		this.storeTracker = new StoreTracker(this.destroyed, route);
		datatugUserService.datatugUserState.subscribe((state) => {
			this.authStatus = state.status;
		});
	}

	ionViewDidLeave(): void {
		console.log('DatatugStorePageComponent.ionViewDidLeave()');
		this.viewDidLeave.next();
	}

	ionViewDidEnter(): void {
		console.log('DatatugStorePageComponent.ionViewDidEnter()', this.storeId);
		if (this.storeId) {
			this.processStoreId(this.storeId);
		}
	}

	ngOnInit() {
		console.log('DatatugStorePageComponent.ngOnInit()');
		this.trackStoreId();
	}

	private trackStoreId(): void {
		this.storeTracker.storeId
			.pipe(
				tap(() => this.storeChanged.next()),
				filter((id) => !!id),
			)
			.subscribe({
				next: this.processStoreId,
				error: this.errorLogger.logErrorHandler('Failed to track store id'),
			});
	}

	processStoreId = (storeId: string | null): void => {
		console.log('DatatugStorePageComponent.processStoreId()', storeId);
		if (storeId === this.storeId) {
			return;
		}
		this.storeId = storeId;
		if (storeId === 'firestore' || storeId === 'github.com') {
			this.loadProjects(storeId);
			return;
		}
		if (storeId) {
			this.agentStateService
				.watchAgentInfo(storeId)
				.pipe(
					takeUntil(
						merge([this.viewDidLeave, this.destroyed, this.storeChanged]),
					),
				)
				.subscribe({
					next: (agentState) => {
						console.log('processStoreId => agentState:', agentState);
						this.agentState = agentState;
						if (!agentState?.isNotAvailable && !this.projects) {
							this.loadProjects(storeId);
						}
					},
					error: this.errorLogger.logErrorHandler(
						'Failed to get agent state info',
					),
				});
		}
	};

	private loadProjects(storeId: string): void {
		this.isLoading = true;
		this.storeService
			.getProjects(storeId)
			.pipe(takeUntil(this.storeChanged), takeUntil(this.destroyed))
			.subscribe({
				next: (projects) => this.processStoreProjects(projects),
				error: (err) => {
					this.isLoading = false;
					if (
						err.name === 'HttpErrorResponse' &&
						err.ok === false &&
						err.status === 0
					) {
						if (!this.agentState?.isNotAvailable) {
							this.agentState = {
								isNotAvailable: true,
								lastCheckedAt: new Date(),
								error: err,
							};
						}
						// this.error = 'Agent is not available at URL: ' + err.url;
					} else {
						this.error = this.errorLogger.logError(
							err,
							`Failed to get list of projects hosted by agent [${storeId}]`,
							{ show: false },
						);
					}
				},
			});
	}

	private processStoreProjects(projects: IProjectBase[]): void {
		console.table(projects);
		this.isLoading = false;
		this.projects = projects;
	}

	ngOnDestroy(): void {
		console.log('DatatugStorePageComponent.ngOnDestroy()');
		this.destroyed.next();
		this.destroyed.complete();
	}

	public goProject(project: IProjectBase, event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.storeId) {
			return;
		}
		const projectContext: IProjectContext = {
			ref: { projectId: project.id, storeId: this.storeId },
			store: { ref: parseStoreRef(this.storeId) },
			brief: {
				access: project.access,
				title: project.title,
			},
		};
		this.nav.goProject(projectContext);
	}

	create(event: Event): void {
		this.newProjectService.openNewProjectDialog(event);
	}
}
