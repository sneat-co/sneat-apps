import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonicModule, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { AuthStatus } from '@sneat/auth-core';
import { SneatErrorCardComponent } from '@sneat/components';
import { parseStoreRef } from '@sneat/core';
import {
	IProjectBase,
	// projectsBriefFromDictToFlatList,
} from '@sneat/datatug-models';
import { DatatugNavService, StoreTracker } from '@sneat/datatug-services-nav';
import {
	AgentStateService,
	DatatugStoreService,
	IAgentState,
} from '@sneat/datatug-services-repo';
import { IDatatugStoreContext, IProjectContext } from '@sneat/datatug-nav';
import {
	NewProjectFormComponent,
	NewProjectService,
} from '@sneat/datatug-project';
import { DatatugUserService } from '@sneat/datatug-services-base';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
	selector: 'sneat-datatug-store-page',
	templateUrl: './datatug-store-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		SneatErrorCardComponent,
		NewProjectFormComponent,
		RouterLink,
	],
})
export class DatatugStorePageComponent
	implements OnInit, OnDestroy, ViewDidLeave, ViewDidEnter
{
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

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly storeService: DatatugStoreService,
		private readonly nav: DatatugNavService,
		private readonly agentStateService: AgentStateService,
		private readonly newProjectService: NewProjectService,
		private readonly datatugUserService: DatatugUserService,
	) {
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
