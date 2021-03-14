import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {distinctUntilChanged, filter, first, map, takeUntil, tap} from 'rxjs/operators';
import {IDatatugProjectBase} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {RepoService} from '@sneat/datatug/services/repo';
import {DatatugNavService} from '@sneat/datatug/services/nav';
import {routingParamRepoId} from '@sneat/datatug/routes';

@Component({
	selector: 'datatug-repo',
	templateUrl: './repo-page.component.html',
})
export class RepoPageComponent implements OnInit, OnDestroy {

	public repoId: Observable<string>;
	public projects: IDatatugProjectBase[];
	public error: any;

	public agentIsOffline: boolean;

	private readonly destroyed = new Subject<void>();
	private readonly agentChanged = new Subject<void>();

	constructor(
		private readonly route: ActivatedRoute,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly repoService: RepoService,
		private readonly nav: DatatugNavService,
	) {
		console.log('RepoPage.constructor()', route, errorLogger, repoService);
		console.log('RepoPage.constructor()');
	}

	ngOnInit() {
		console.log('RepoPage.ngOnInit()');
		this.trackRepoId();
	}

	private trackRepoId(): void {
		this.repoId = this.route.paramMap
			.pipe(
				takeUntil(this.destroyed),
				map(params => params.get(routingParamRepoId)),
				distinctUntilChanged(),
				tap(() => this.agentChanged.next()),
				filter(repoId => !!repoId),
				tap(repoId => {
					this.processRepoId(repoId)
				}),
			);
	}

	private processRepoId(repoId: string): void {
		this.repoService.getProjects(repoId)
			.pipe(
				takeUntil(this.agentChanged),
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: projects => this.processRepoProjects(projects),
				error: err => {
					if (err.name === 'HttpErrorResponse' && err.ok === false && err.status === 0) {
						this.agentIsOffline = true;
						// this.error = 'Agent is not available at URL: ' + err.url;
					} else {
						this.error = this.errorLogger.logError(err,
							`Failed to get list of projects hosted by agent [${repoId}]`, {show: false});
					}
				},
			});
	}

	private processRepoProjects(projects: IDatatugProjectBase[]): void {
		console.table(projects);
		this.projects = projects;
	}

	ngOnDestroy(): void {
		console.log('RepoPage.ngOnDestroy()');
		this.destroyed.next();
	}

	public goProject(project: IDatatugProjectBase, event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.repoId
			.pipe(first())
			.subscribe(repoId => this.nav.goProject(repoId, project.id));
	}
}
