import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {distinctUntilChanged, filter, first, map, takeUntil, tap} from 'rxjs/operators';
import {IProjectBase} from '@sneat/datatug/models';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {RepoService} from '@sneat/datatug/services/repo';
import {DatatugNavService} from '@sneat/datatug/services/nav';
import {routingParamRepoId} from '@sneat/datatug/routes';

@Component({
	selector: 'datatug-repo',
	templateUrl: './repo.page.html',
})
export class RepoPage implements OnInit, OnDestroy {

	public repoId: Observable<string>;
	public projects: IProjectBase[];
	public error: any;

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
		this.repoId = this.route.paramMap
			.pipe(
				takeUntil(this.destroyed),
				map(params => params.get(routingParamRepoId)),
				distinctUntilChanged(),
				tap(() => this.agentChanged.next()),
				filter(repoId => !!repoId),
				tap(repoId => {
					this.repoService.getProjects(repoId)
						.pipe(takeUntil(this.agentChanged))
						.subscribe({
							next: projects => {
								console.table(projects);
								this.projects = projects;
							},
							error: err => {
								if (err.name === 'HttpErrorResponse' && err.ok === false && err.status === 0) {
									this.error = 'Agent is not available at URL: ' + err.url;
								} else {
									this.error = this.errorLogger.logError(err,
										`Failed to get list of projects hosted by agent [${repoId}]`, {show: false});
								}
							},
						});
				}),
			);
	}

	ngOnDestroy(): void {
		console.log('RepoPage.ngOnDestroy()');
		this.agentChanged.next();
		this.destroyed.next();
	}

	go(project: IProjectBase): void {
		this.repoId
			.pipe(first())
			.subscribe(repoId => this.nav.goProject(repoId, project.id));
	}
}
