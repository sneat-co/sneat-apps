import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs/operators';
import {IDatatugProjectBase} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {AgentStateService, IAgentState, StoreService} from '@sneat/datatug/services/repo';
import {DatatugNavService} from '@sneat/datatug/services/nav';
import {routingParamRepoId} from '@sneat/datatug/routes';
import {ViewDidEnter, ViewDidLeave} from "@ionic/angular";

@Component({
	selector: 'datatug-repo',
	templateUrl: './store-page.component.html',
})
export class StorePageComponent implements OnInit, OnDestroy, ViewDidLeave, ViewDidEnter {

	public storeId: string;
	public projects: IDatatugProjectBase[];
	public error: any;

	public agentState: IAgentState;
	public isLoading: boolean;

	private readonly destroyed = new Subject<void>();
	private readonly viewDidLeave = new Subject<void>();
	private readonly agentChanged = new Subject<void>();

	constructor(
		private readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly storeService: StoreService,
		private readonly nav: DatatugNavService,
		private readonly agentStateService: AgentStateService,
	) {
		console.log('RepoPage.constructor()', route, errorLogger, storeService);
		console.log('RepoPage.constructor()');
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
		this.trackRepoId();
	}

	private trackRepoId(): void {
		this.route.paramMap
			.pipe(
				takeUntil(this.destroyed),
				map(params => params.get(routingParamRepoId)),
				distinctUntilChanged(),
				tap(() => this.agentChanged.next()),
				filter(repoId => !!repoId),
			).subscribe({
			next: repoId => {
				this.storeId = repoId;
				this.processStoreId(repoId)
			},
			error: this.errorLogger.logErrorHandler('Failed to track store id'),
		});
	}

	private processStoreId(storeId: string): void {
		this.agentStateService
			.watchAgentInfo(storeId)
			.pipe(
				takeUntil(this.viewDidLeave),
				takeUntil(this.destroyed),
				takeUntil(this.agentChanged),
			)
			.subscribe({
				next: agentState => {
					console.log('processRepoId => agentState:', agentState);
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
				takeUntil(this.agentChanged),
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: projects => this.processRepoProjects(projects),
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

	private processRepoProjects(projects: IDatatugProjectBase[]): void {
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
		this.nav.goProject(this.storeId, project.id);
	}

}
