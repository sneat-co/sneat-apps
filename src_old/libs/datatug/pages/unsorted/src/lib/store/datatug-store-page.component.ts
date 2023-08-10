import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { IProjectBase, projectsBriefFromDictToFlatList } from '@sneat/datatug/models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { AgentStateService, DatatugStoreService, IAgentState } from '@sneat/datatug/services/repo';
import { DatatugNavService, StoreTracker } from '@sneat/datatug/services/nav';
import { ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { NewProjectService } from '@sneat/datatug/project';
import { DatatugUserService } from '@sneat/datatug/services/base';
import { AuthStatus } from '@sneat/auth-core';
import { IDatatugStoreContext, IProjectContext } from '@sneat/datatug/nav';
import { parseStoreRef } from '@sneat/core';

@Component({
	selector: 'datatug-store-page',
	templateUrl: './datatug-store-page.component.html',
})
export class DatatugStorePageComponent
	implements OnInit, OnDestroy, ViewDidLeave, ViewDidEnter {
	public storeId: string;
	public projects: IProjectBase[];
	public error: any;

	public agentState: IAgentState;
	public isLoading: boolean;

	private readonly destroyed = new Subject<void>();
	private readonly viewDidLeave = new Subject<void>();
	private readonly storeChanged = new Subject<void>();

	private readonly storeTracker: StoreTracker;

	private authStatus: AuthStatus;

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
			const projects = projectsBriefFromDictToFlatList(store.brief.projects);
			this.projects = projects;
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

	processStoreId = (storeId: string): void => {
		console.log('DatatugStorePageComponent.processStoreId()', storeId);
		if (storeId === this.storeId) {
			return;
		}
		this.storeId = storeId;
		if (storeId === 'firestore' || storeId === 'github.com') {
			this.loadProjects(storeId);
			return;
		}
		this.agentStateService
			.watchAgentInfo(storeId)
			.pipe(
				takeUntil(merge([this.viewDidLeave, this.destroyed, this.storeChanged])),
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
