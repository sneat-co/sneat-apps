import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { IProjectRef } from '@sneat/datatug/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
	IEnvDbServer,
	IEnvironmentSummary,
	IParameter,
	IQueryDef,
	ISqlQueryRequest,
	QueryType,
} from '@sneat/datatug/models';
import { Coordinator } from '@sneat/datatug/executor';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { EnvironmentService } from '@sneat/datatug/services/unsorted';
import { RandomIdService } from '@sneat/random';
import { DatatugNavContextService, ProjectTracker } from '@sneat/datatug/services/nav';
import { IProjectContext, newProjectContextFromRef } from '@sneat/datatug/nav';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ViewDidEnter } from '@ionic/angular';
import { IQueryEditorState, IQueryEnvState, IQueryState } from '@sneat/datatug/editor';
import { isQueryChanged, QueryEditorStateService } from '../../query-editor-state-service';
import { QueriesService } from '../../queries.service';
import { QueryContextSqlService } from '../../query-context-sql.service';

@Component({
	selector: 'datatug-sql-editor',
	templateUrl: './query-page.component.html',
})
export class QueryPageComponent implements OnDestroy, ViewDidEnter {
	public project?: IProjectContext;

	public showQueryBuilder?: boolean;
	public editorTab: 'text' | 'builder' = 'text';

	public parameters?: IParameter[];

	public editorState?: IQueryEditorState = undefined;
	public queryState: IQueryState = {
		id: '',
		queryType: QueryType.SQL,
		request: {
			queryType: QueryType.SQL,
			text: '',
		} as ISqlQueryRequest,
	};

	public get activeEnv(): IQueryEnvState | undefined {
		return this.queryState?.activeEnv;
	}

	public get queryId(): string | undefined {
		return this.queryState?.id;
	}

	public queryFolderPath = '';
	public envId?: string;
	public envDbServerId?: string;
	// noinspection SqlDialectInspection,SqlNoDataSourceInspection
	public environments?: ReadonlyArray<IQueryEnvState>;

	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly randomIdService: RandomIdService,
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly queryContextSqlService: QueryContextSqlService,
		private readonly queriesService: QueriesService,
		private readonly coordinator: Coordinator,
		private readonly queryEditorStateService: QueryEditorStateService,
		private readonly envService: EnvironmentService,
		private readonly changeDetector: ChangeDetectorRef,
	) {
		console.log('QueryPage.constructor()', location.hash);
		this.trackQueryState();
		const query = history.state.query as IQueryDef;
		if (query) {
			this.setQuery(query);
		}

		this.trackCurrentEnv();
		this.trackCurrentProject();
		this.trackQueryParams();
		this.trackProject();
	}

	ionViewDidEnter(): void {
		try {
			this.updateUrl(); // If called in constructor breaks back button
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process ionViewDidEnter event');
		}
	}

	private readonly onQueryEditorStateChanged = (
		editorState?: IQueryEditorState,
	): void => {
		try {
			this.editorState = editorState;
			if (!editorState?.currentQueryId) {
				return;
			}
			const queryState = editorState.activeQueries.find(
				(qs) => qs.id === editorState.currentQueryId,
			);
			if (!queryState) {
				return;
			}
			console.log('onQueryEditorStateChanged', queryState);
			this.queryState = queryState;
			if (this.queryState.environments && !this.queryState.activeEnv) {
				this.setActiveEnv(this.queryState.environments[0].id);
			}
			if (queryState.activeEnv?.id && queryState.activeEnv.id !== this.envId) {
				this.envId = queryState?.activeEnv.id;
				this.datatugNavContextService.setCurrentEnvironment(this.envId);
			}
		} catch (e) {
			this.errorLogger.logError(
				e,
				'Failed to process query editor state change',
			);
		}
	};

	ngOnDestroy(): void {
		if (this.destroyed) {
			this.destroyed.next();
			this.destroyed.complete();
		}
	}

	public onParametersChanged(parameters: IParameter[]): void {
		console.log('onParametersChanged:', parameters);
		this.parameters = parameters;
	}

	private trackQueryState(): void {
		this.queryEditorStateService.queryEditorState
			.pipe(distinctUntilChanged())
			.subscribe({
				next: this.onQueryEditorStateChanged,
				error: this.errorLogger.logErrorHandler(
					'Failed to get query editor stage',
				),
			});
	}

	private trackCurrentEnv(): void {
		this.datatugNavContextService.currentEnv
			.pipe(takeUntil(this.destroyed))
			.subscribe((currentEnv) => {
				try {
					console.log('trackCurrentEnv() => ', currentEnv);
					if (!currentEnv) {
						return;
					}
					const { id } = currentEnv;
					if (!id) {
						return;
					}
					this.envId = id;

					let activeEnv = this.queryState.environments?.find(
						(env) => env.id === id,
					) || {
						id,
						summary: currentEnv.summary,
					};
					if (!activeEnv.summary && currentEnv.summary) {
						activeEnv = { ...activeEnv, summary: currentEnv.summary };
					}
					let environments: ReadonlyArray<IQueryEnvState> = this.queryState
						.environments || [activeEnv];
					if (!environments.find((item) => item.id == id)) {
						environments = [...environments, activeEnv];
					}
					this.updateQueryState({
						...this.queryState,
						activeEnv,
						environments,
					});
				} catch (e) {
					this.errorLogger.logError(
						e,
						'Failed to process change of current environment',
					);
				}
			});
	}

	private updateQueryState(queryState: IQueryState): void {
		this.queryEditorStateService.updateQueryState(queryState);
	}

	private trackCurrentProject(): void {
		this.datatugNavContextService.currentProject
			.pipe(takeUntil(this.destroyed))
			.subscribe((currentProject) => {
				console.log('SqlQueryPage => currentProject:', currentProject);
				if (
					!currentProject ||
					(this.project?.ref.projectId === currentProject.ref.projectId &&
						this.project?.ref.storeId === currentProject.ref.storeId &&
						this.project?.summary?.environments?.length ===
						currentProject.summary?.environments?.length)
				) {
					return; // TODO: cleanup query state?
				}
				this.project = currentProject;
				const summary = currentProject?.summary;
				if (!summary) {
					return;
				}
			});
	}

	private setActiveEnv(envId: string): void {
		try {
			if (!envId) {
				this.errorLogger.logError(
					'An attempt to set active environment to: ' + envId,
				);
				return;
			}
			const queryState = this.queryId && this.getQueryState(this.queryId);
			if (!queryState) {
				this.errorLogger.logError(
					'An attempt to set unknown env as an active one: ' + envId,
				);
				return;
			}
			const activeEnv = queryState.environments?.find(
				(env) => env.id === envId,
			) || {
				id: envId,
				parameters: this.parameters && [...this.parameters],
			};
			if (queryState.activeEnv !== activeEnv) {
				this.updateQueryState({
					...queryState,
					activeEnv,
					environments: queryState.environments || [activeEnv],
				});
			}
			if (!activeEnv.summary) {
				// Potentially can be duplicate calls if user changes env back and forth before response comes back
				if (this.project) {
					this.getEnvData(this.project.ref, envId);
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to set active environment');
		}
	}

	private getEnvData(projRef: IProjectRef, envId: string): void {
		const queryId = this.queryId;

		if (queryId) {
			this.envService
				.getEnvSummary(projRef, envId)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: envSummary => this.onEnvSummaryReceived(queryId, envId, envSummary),
					error: this.errorLogger.logErrorHandler('Failed to get env summary'),
				});
		}
	}

	private onEnvSummaryReceived(queryId: string, envId: string, envSummary: IEnvironmentSummary): void {
		console.log('envSummary:', envSummary);
		if (!envSummary) {
			this.errorLogger.logError(
				'getEnvSummary returned nothing for envId=' + envId,
			);
			return;
		}
		const queryState = this.getQueryState(queryId);
		if (!queryState) {
			// The query has been closed since execution requested.
			// A 100% proper way would be TODO: takeUntil(IQueryState.destroyed:Observable<void>)
			return;
		}
		const queryEnv = queryState.environments?.find(
			(env) => env.id == envId,
		);
		if (!queryEnv) {
			// Can't see how it is possible but just in case
			this.errorLogger.logError(
				'received env details for unknown environment: ' + envSummary.id,
			);
			return;
		}
		if (!this.queryState.activeEnv) {
			return;
		}
		let envState: IQueryEnvState = {
			...this.queryState.activeEnv,
			summary: envSummary,
		};
		if (envSummary.dbServers?.length) {
			const envDbServer = envSummary.dbServers[0];
			envState = {
				...envState,
				dbServer: envDbServer,
				dbServerId: this.getDbServerId(envDbServer),
				catalogId:
					envDbServer.catalogs?.length ? envDbServer.catalogs[0] : undefined,
			};
		}
		if (queryId) {
			const queryState = this.getQueryState(queryId);
			this.updateEnvState(envState, queryState);
		}
	}

	public getDbServerId(dbServer: IEnvDbServer): string {
		return `${dbServer.driver}:${dbServer.host}`;
	}

	private trackQueryParams(): void {
		this.route.queryParamMap.subscribe({
			next: (queryParams) => {
				console.log(
					'QueryPageComponent.trackQueryParams(): queryParams:',
					queryParams,
				);

				const envId = queryParams.get('env');
				if (envId) {
					this.setActiveEnv(envId);
				}

				let queryId = queryParams.get('id');
				const isNew = !queryId;
				if (isNew) {
					queryId = this.randomIdService.newRandomId();
					queryId = '' + (this.editorState?.activeQueries?.length || 1);
				}
				this.setQueryId(queryId, isNew);
			},
		});
	}

	private onProjRefChanged = (ref: IProjectRef) => {
		const prevProject = this.project;
		this.project = newProjectContextFromRef(ref);
		if (
			this.queryId &&
			(ref.projectId !== prevProject?.ref?.projectId ||
				ref.storeId !== prevProject?.ref?.storeId)
		) {
			// this.loadQuery();
		}
	};

	private trackProject(): void {
		const projectTracker = new ProjectTracker(this.destroyed, this.route);
		projectTracker.projectRef.subscribe({
			next: this.onProjRefChanged,
			error: this.errorLogger.logErrorHandler(
				'Failed to track project ref from activated router',
			),
		});
	}

	private setQueryId(id?: string | null, isNew: boolean = false): void {
		if (this.queryId === id) {
			return;
		}
		if (!id) {
			this.queryFolderPath = '';
			return;
		}
		const i = id.lastIndexOf('/');
		if (i >= 0) {
			this.queryFolderPath = id.substring(0, i);
		}
		if (!isNew) {
			this.queryEditorStateService.openQuery(id);
		}
	}

	private setQuery(query: IQueryDef): void {
		const queryState: IQueryState = this.getQueryState(query.id) || {
			id: query.id,
			queryType: query.request.queryType,
			title: query.title,
			request: query.request,
			def: query,
		};
		this.updateQueryState(
			queryState.def === query
				? queryState
				: {
					...queryState,
					isNew: false,
					queryType: query.request.queryType,
					def: query,
					request: {
						queryType: query.request.queryType,
						text: (query.request as ISqlQueryRequest).text,
					} as ISqlQueryRequest,
				},
		);
	}

	public get isChanged(): boolean {
		return isQueryChanged(this.queryState);
	}

	serverChanged(event: CustomEvent): void {
		if (event.detail.value === this.activeEnv?.dbServerId) {
			return;
		}
		if (!this.activeEnv) {
			return;
		}
		const envState: IQueryEnvState = {
			...this.activeEnv,
			dbServerId: this.envDbServerId,
		};
		this.updateEnvState(envState, this.queryState);
	}

	catalogChanged(event: CustomEvent): void {
		console.log(
			'catalogChanged',
			event.detail.value,
			this.activeEnv?.catalogId,
		);
		if (event.detail.value === this.activeEnv?.catalogId) {
			return;
		}
		if (this.activeEnv) {
			this.updateEnvState(
				{
					...this.activeEnv,
					catalogId: event.detail.value,
				},
				this.queryState,
			);
		}
	}

	envChanged(event: CustomEvent): void {
		const { value } = event.detail;
		const activeEnv = this.queryState?.environments?.find((v) => v.id === value);
		this.updateQueryState({
			...this.queryState,
			activeEnv,
		});
		if (this.project && this.activeEnv && !this.activeEnv.summary) {
			this.getEnvData(this.project.ref, this.activeEnv.id);
		}
		this.updateUrl();
	}

	editorTabChanged(): void {
		this.updateUrl();
	}

	public queryTitleChanged(event: Event): void {
		const ce = event as CustomEvent;
		this.queryState = {
			...this.queryState,
			title: ce.detail.value || '',
		};
		this.queryEditorStateService.updateQueryState(this.queryState);
	}

	updateUrl(): void {
		// TODO: make sure not clashes with SqlQueryEditComponent
		const queryParams: Params = {
			id: this.queryId,
			editor: this.editorTab,
			env: this.queryState.activeEnv?.id,
		};
		this.router
			.navigate([], {
				// preserveFragment: true,
				replaceUrl: true,
				relativeTo: this.route,
				queryParams,
				queryParamsHandling: 'merge', // remove to replace all query params by provided
			})
			.catch(
				this.errorLogger.logErrorHandler('Failed to change query parameter'),
			);
	}

	private getQueryState(id: string): IQueryState | undefined {
		return this.queryEditorStateService.getQueryState(id);
	}

	private updateEnvState(
		envState: IQueryEnvState,
		queryState?: IQueryState,
	): IQueryEnvState | undefined {
		console.log('updateEnvState', envState);
		if (!envState.id) {
			throw new Error('!envState.id');
		}
		if (!queryState) {
			return undefined;
		}
		if (queryState.activeEnv?.id == envState.id) {
			queryState = { ...queryState, activeEnv: envState };
		}
		queryState = {
			...queryState,
			environments: queryState.environments?.map((env) =>
				env.id === envState.id ? envState : env,
			),
		};
		this.updateQueryState(queryState);
		return envState;
	}

	public saveChanges(): void {
		if (!this.isChanged) {
			alert('Query does not require saving as is not changed yet');
			return;
		}
		if (this.project) {
			this.queryEditorStateService
				.saveQuery(this.queryState, this.project.ref)
				.subscribe({
					error: this.errorLogger.logErrorHandler('Failed to save query'),
				});
		}
	}
}
