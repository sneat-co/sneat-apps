import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {IDatatugProjectBase} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {AgentStateService, IAgentState, DatatugStoreService} from '@sneat/datatug/services/repo';
import {DatatugNavService} from '@sneat/datatug/services/nav';
import {routingParamStoreId} from '@sneat/datatug/core';
import {ViewDidEnter, ViewDidLeave} from "@ionic/angular";
import {NewProjectService} from '../../../../../project/src/lib/new-project/new-project.service';

@Component({
	selector: 'datatug-store-page',
	templateUrl: './datatug-store-page.component.html',
})
export class DatatugStorePageComponent implements OnInit, OnDestroy, ViewDidLeave, ViewDidEnter {

	public storeId: string;
	public projects: IDatatugProjectBase[];
	public error: any;

	public agentState: IAgentState;
	public isLoading: boolean;

	private readonly destroyed = new Subject<void>();
	private readonly viewDidLeave = new Subject<void>();
	private readonly storeChanged = new Subject<void>();

	constructor(
		private readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly storeService: DatatugStoreService,
		private readonly nav: DatatugNavService,
		private readonly agentStateService: AgentStateService,
		private readonly newProjectService: NewProjectService,
	) {
		console.log('DatatugStorePageComponent.constructor()');
	}

	ionViewDidLeave(): void {
		console.log('RepoPageComponent.ionViewDidLeave()');
		this.viewDidLeave.next();
	}

	ionViewDidEnter(): void {
		console.log('RepoPageComponent.ionViewDidEnter()', this.storeId);
		if (this.storeId) {
			this.processStoreId(this.storeId)
		}
	}

	ngOnInit() {
		console.log('RepoPage.ngOnInit()');
		this.trackStoreId();
	}

	private trackStoreId(): void {
		this.route.paramMap
			.pipe(
				takeUntil(this.destroyed),
				map(params => params.get(routingParamStoreId)),
				distinctUntilChanged(),
				tap(() => this.storeChanged.next()),
				filter(id => !!id),
			).subscribe({
			next: storeId => {
				this.storeId = storeId;
				this.processStoreId(storeId)
			},
			error: this.errorLogger.logErrorHandler('Failed to track store id'),
		});
	}

	private processStoreId(storeId: string): void {
		if (storeId === 'firestore' || storeId === 'github.com') {
			this.loadProjects(storeId);
			return;
		}
		this.agentStateService
			.watchAgentInfo(storeId)
			.pipe(
				takeUntil(this.viewDidLeave),
				takeUntil(this.destroyed),
				takeUntil(this.storeChanged),
			)
			.subscribe({
				next: agentState => {
					console.log('processStoreId => agentState:', agentState);
					this.agentState = agentState;
					if (!agentState?.isNotAvailable && !this.projects) {
						this.loadProjects(storeId);
					}
				},
				error: this.errorLogger.logErrorHandler('Failed to get agent state info'),
			});
	}

	private loadProjects(storeId: string): void {
		this.isLoading = true;
		this.storeService.getProjects(storeId)
			.pipe(
				takeUntil(this.storeChanged),
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: projects => this.processStoreProjects(projects),
				error: err => {
					this.isLoading = false;
					if (err.name === 'HttpErrorResponse' && err.ok === false && err.status === 0) {
						if (!this.agentState?.isNotAvailable) {
							this.agentState = {
								isNotAvailable: true,
								lastCheckedAt: new Date(),
								error: err,
							}
						}
						// this.error = 'Agent is not available at URL: ' + err.url;
					} else {
						this.error = this.errorLogger.logError(err,
							`Failed to get list of projects hosted by agent [${storeId}]`, {show: false});
					}
				},
			});
	}

	private processStoreProjects(projects: IDatatugProjectBase[]): void {
		console.table(projects);
		this.isLoading = false;
		this.projects = projects;
	}

	ngOnDestroy(): void {
		console.log('RepoPage.ngOnDestroy()');
		this.destroyed.next();
	}

	public goProject(project: IDatatugProjectBase, event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.nav.goProject({storeId: this.storeId, projectId: project.id});
	}

	create(event: Event): void {
		this.newProjectService.openNewProjectDialog(event);
	}

}
