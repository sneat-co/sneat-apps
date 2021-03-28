import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
	ICommandResponseItem,
	ICommandResponseWithRecordset,
	IEnvDbServer,
	IExecuteRequest,
	IParameter,
	IQueryDef,
	ISqlCommandRequest
} from '@sneat/datatug/models';
import {Coordinator} from '@sneat/datatug/executor';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {
	EnvironmentService,
	IAstQuery,
	QueriesService,
	QueryContextSqlService,
	SqlParser
} from '@sneat/datatug/services/unsorted';
import {IRecordsetResult} from '@sneat/datatug/dto';
import {RandomId} from "@sneat/random";
import {ISqlChanged} from "./intefaces";
import {
	IQueryEditorState,
	IQueryEnvState,
	IQueryState,
	ISqlQueryTarget,
	isQueryChanged,
	QueryEditorStateService
} from "@sneat/datatug/queries";
import {DatatugNavContextService} from "@sneat/datatug/services/nav";
import {IDatatugProjectContext} from "@sneat/datatug/nav";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {ViewDidEnter} from "@ionic/angular";


@Component({
	selector: 'datatug-sql-editor',
	templateUrl: './sql-query-page.component.html',
	styleUrls: ['./sql-query-page.component.scss'],
})
export class SqlQueryPageComponent implements OnDestroy, ViewDidEnter {

	public editorTab: 'text' | 'builder' = 'text';

	public queryState: IQueryState = {id: undefined, text: ''};

	public get activeEnv(): IQueryEnvState {
		return this.queryState?.activeEnv;
	}

	public get queryId(): string {
		return this.queryState?.id;
	}

	public queryNamePlaceholder: string;
	public targetCatalog: string;
	public queryFolderPath = '';
	public envId;
	public envDbServerId: string;
	// noinspection SqlDialectInspection,SqlNoDataSourceInspection
	public sql = '';
	public queryAst: IAstQuery;
	public projectContext: IDatatugProjRef;
	public environments: ReadonlyArray<IQueryEnvState>;
	public dbDriver: 'sqlite3' | 'sqlserver' = 'sqlite3';

	public parameters: IParameter[];
	private target: ISqlQueryTarget;

	public currentProject: IDatatugProjectContext;

	private readonly destroyed = new Subject<void>();
	public readonly sqlParser = new SqlParser();
	public readonly trackByIndex = (i: number) => i;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
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
		this.queryEditorStateService.queryEditorState
			.pipe(
				distinctUntilChanged(),
			)
			.subscribe({
				next: this.onQueryEditorStateChanged,
				error: this.errorLogger.logErrorHandler('Failed to get query editor stage'),
			});
		const query = history.state.query as IQueryDef;
		if (query) {
			this.setQuery(query);
		}

		if (location.hash.startsWith('#text=')) {
			this.sql = decodeURIComponent(location.hash.substr(6).replace(/\+/g, '%20'));
			this.onSqlChanged(this.sql);
		}

		this.trackCurrentEnv();
		this.trackCurrentProject()
		this.trackQueryParams();
		this.trackParamMap();
	}

	ionViewDidEnter(): void {
		try {
			this.updateUrl(); // If called in constructor breaks back button
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process ionViewDidEnter event');
		}
	}

	private readonly onQueryEditorStateChanged = (editorState: IQueryEditorState): void => {
		try {
			if (!editorState.currentQueryId) {
				return;
			}
			const queryState = editorState.activeQueries.find(qs => qs.id === editorState.currentQueryId);
			if (!queryState) {
				return;
			}
			console.log('onQueryEditorStateChanged', queryState);
			this.queryState = queryState;
			if (this.sql != queryState.text) {
				this.sql = queryState.text;
			}
			if (this.queryState.environments && !this.queryState.activeEnv) {
				this.setActiveEnv(this.queryState.environments[0].id)
				const dbModels = this.currentProject?.summary?.dbModels;
				if (dbModels?.length === 1) {
					this.updateQueryState({
						...this.queryState,
						targetDbModel: dbModels[0],
					});
				}
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process query editor state change');
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

	private trackCurrentEnv(): void {
		this.datatugNavContextService.currentEnv
			.pipe(takeUntil(this.destroyed))
			.subscribe(currentEnv => {
				try {
					console.log('trackCurrentEnv() => ', currentEnv);
					if (!currentEnv) {
						return;
					}
					const {id} = currentEnv;
					if (!id) {
						return;
					}
					this.envId = id

					let activeEnv = this.queryState.environments?.find(env => env.id === id) || {
						id,
						summary: currentEnv.summary
					};
					if (!activeEnv.summary && currentEnv.summary) {
						activeEnv = {...activeEnv, summary: currentEnv.summary};
					}
					let environments: ReadonlyArray<IQueryEnvState> = this.queryState.environments || [activeEnv];
					if (!environments.find(item => item.id == id)) {
						environments = [...environments, activeEnv];
					}
					this.updateQueryState({
						...this.queryState,
						activeEnv,
						environments,
					})
				} catch (e) {
					this.errorLogger.logError(e, 'Failed to process change of current environment');
				}
			});
	}

	private updateQueryState(queryState: IQueryState): void {
		this.queryEditorStateService.updateQueryState(queryState);
	}

	private trackCurrentProject(): void {
		this.datatugNavContextService.currentProject
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe(currentProject => {
				console.log('SqlQueryPage => currentProject:', currentProject)
				if (
					!currentProject ||
					this.currentProject?.projectId === currentProject.projectId
					&& this.currentProject?.repoId === currentProject.repoId
					&& this.currentProject?.summary?.environments?.length === currentProject.summary?.environments?.length
				) {
					return; // TODO: cleanup query state?
				}
				this.currentProject = currentProject;
				const summary = currentProject?.summary;
				if (!summary) {
					return;
				}
			});
	}

	private setActiveEnv(envId: string): void {
		try {
			if (!envId) {
				this.errorLogger.logError('An attempt to set active environment to: ' + envId);
				return;
			}
			const queryState = this.getQueryState(this.queryId);
			if (!queryState) {
				this.errorLogger.logError('An attempt to set unknown env as an active one: ' + envId);
				return;
			}
			const activeEnv = queryState.environments?.find(env => env.id === envId) || {
				id: envId,
				parameters: this.parameters && [...this.parameters]
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
				this.getEnvData(this.currentProject, envId);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to set active environment');
		}
	}

	private getEnvData(datatugProjectContext: IDatatugProjectContext, envId: string): void {
		const queryId = this.queryId;

		this.envService.getEnvSummary(datatugProjectContext, envId)
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: envSummary => {
					console.log('envSummary:', envSummary);
					if (!envSummary) {
						this.errorLogger.logError('getEnvSummary returned nothing for envId=' + envId);
						return
					}
					const queryState = this.getQueryState(queryId);
					if (!queryState) {
						// The query has been closed since execution requested.
						// A 100% proper way would be TODO: takeUntil(IQueryState.destroyed:Observable<void>)
						return;
					}
					const queryEnv = queryState.environments?.find(env => env.id == envId);
					if (!queryEnv) {
						// Can't see how it is possible but just in case
						this.errorLogger.logError('received env details for unknown environment: ' + envSummary.id);
						return;
					}
					let envState = {
						...this.queryState.activeEnv,
						summary: envSummary,
					};
					if (envSummary.dbServers?.length) {
						const envDbServer = envSummary.dbServers[0];
						envState = {
							...envState,
							parameters: this.parameters && [...this.parameters],
							dbServer: envDbServer,
							dbServerId: this.getDbServerId(envDbServer),
							catalogId: envDbServer.catalogs?.length && envDbServer.catalogs[0],
						}
					}
					this.updateEnvState(envState, this.getQueryState(queryId));
				},
				error: this.errorLogger.logErrorHandler('Failed to get env summary'),
			});
	}

	public getDbServerId(dbServer: IEnvDbServer): string {
		return `${dbServer.driver}:${dbServer.host}`;
	}

	private trackQueryParams(): void {
		this.route.queryParamMap.subscribe({
			next: queryParams => {
				console.log('queryParams:', queryParams);
				let queryId = queryParams.get('id');
				const isNew = !queryId;
				if (isNew) {
					queryId = RandomId.newRandomId();
				}
				this.setQueryId(queryId, isNew);

				const envId = queryParams.get('env');
				if (envId) {
					this.setActiveEnv(envId);
				}
				this.target = {
					...(this.target || {}),
					server: queryParams.get('server'),
					catalog: queryParams.get('catalog'),
					driver: queryParams.get('driver'),
				} as ISqlQueryTarget;
				console.log('target', this.target);
				this.updateQueryContext();
			}
		});
	}

	private trackParamMap(): void {
		this.route.paramMap.subscribe({
			next: paramMap => {
				console.log('QueryPage.constructor() => paramMap:', paramMap);

				const projContext: IDatatugProjRef = {
					projectId: paramMap.get('projectId'),
					repoId: paramMap.get('repoId'),
				};
				if (projContext.repoId && projContext.projectId) {
					this.target = {
						...(this.target || {}),
						repository: projContext.repoId,
						project: projContext.projectId,
					} as ISqlQueryTarget;
					console.log('target', this.target);
					this.updateQueryContext();
				}
				const prevProjectContext = this.projectContext;
				this.projectContext = projContext;
				if (this.queryId && (
					projContext.projectId !== prevProjectContext?.projectId ||
					projContext.repoId !== prevProjectContext?.repoId
				)) {
					// this.loadQuery();
				}
			},
			error: this.errorLogger.logErrorHandler('Failed to get query params from activated router'),
		});

	}

	private setQueryId(id: string, isNew: boolean = false): void {
		if (this.queryId == id) {
			return;
		}
		this.queryNamePlaceholder = isNew ? 'New query - title is a required field' : 'Title is a required field';
		const i = id.lastIndexOf('/');
		if (i >= 0) {
			this.queryFolderPath = id.substring(0, i);
		}
		if (isNew) {
			if (!this.sql) {
				this.sql = 'select' + ' * ' + 'from ';
			}
		}
		if (isNew) {
			this.queryEditorStateService.newQuery({id, text: this.sql, isNew});
		} else {
			this.queryEditorStateService.openQuery(id);
		}
	}

	private setQuery(query: IQueryDef): void {
		const queryState = this.getQueryState(query.id) || {
			id: query.id,
			title: query.title,
			text: query.text,
			def: query,
		};
		this.updateQueryState(queryState.def === query ? queryState : {
			...queryState,
			isNew: false,
			def: query,
			text: query.text,
		});
		this.sql = query.text;
		if (query.targets?.length && !this.targetCatalog) {
			this.targetCatalog = query.targets[0].catalog;
		}
	}

	private updateQueryContext(): void {
		console.log('updateQueryContext()', this.target);
		if (this.target.repository && this.target.project && this.target.driver && this.target.server && this.target.catalog) {
			this.queryContextSqlService.setTarget(this.target);
		}
	}

	public get isChanged(): boolean {
		return isQueryChanged(this.queryState);
	}

	serverChanged(event: CustomEvent): void {
		if (event.detail.value === this.activeEnv?.dbServerId) {
			return
		}
		this.updateEnvState({
			...this.activeEnv,
			dbServerId: this.envDbServerId,
		}, this.queryState);
	}

	catalogChanged(event: CustomEvent): void {
		console.log('catalogChanged', event.detail.value, this.activeEnv?.catalogId);
		if (event.detail.value === this.activeEnv?.catalogId) {
			return
		}
		this.updateEnvState({
			...this.activeEnv,
			catalogId: event.detail.value,
		}, this.queryState);
	}

	envChanged(event: CustomEvent): void {
		const {value} = event.detail;
		this.updateQueryState({
			...this.queryState,
			activeEnv: this.queryState.environments.find(v => v.id === value),
		})
		if (this.activeEnv && !this.activeEnv.summary) {
			this.getEnvData(this.currentProject, this.activeEnv.id);
		}

		this.datatugNavContextService.setCurrentEnvironment(this.envId);
		this.updateUrl();
	}

	editorTabChanged(): void {
		this.updateUrl();
	}

	public queryTitleChanged(event: CustomEvent): void {
		this.queryState = {
			...this.queryState,
			title: event.detail.value || '',
		};
		this.queryEditorStateService.updateQueryState(this.queryState);
	}

	updateUrl(): void {
		const queryParams: Params = {
			editor: this.editorTab,
			env: this.queryState.activeEnv?.id,
		};
		if (this.queryState.isNew) {
			queryParams.text = this.sql;
		}
		this.router.navigate(
			[],
			{
				// preserveFragment: true,
				replaceUrl: true,
				relativeTo: this.route,
				queryParams,
				queryParamsHandling: 'merge', // remove to replace all query params by provided
			}).catch(this.errorLogger.logErrorHandler('Failed to change query parameter'));
	}

	executeFromTab(event: Event, env: IQueryEnvState): void {
		event.preventDefault();
		event.stopPropagation();
		this.updateQueryState({
			...this.queryState,
			activeEnv: env,
		})
		setTimeout(() => this.executeQuery(), 1);
	}

	executeQuery(): void {
		if (!this.activeEnv.catalogId) {
			alert('select target catalog 1st');
			return;
		}
		const sqlCommandRequest: ISqlCommandRequest = {
			type: 'SQL',
			driver: this.activeEnv.dbServer.driver,
			db: this.activeEnv.catalogId,
			env: this.envId,
			text: this.sql,
			namedParams: this.parameters?.length ? {} : undefined,
		}

		const parameters = this.parameters && [...this.parameters];

		if (parameters?.length) {
			parameters.forEach(p => {
				sqlCommandRequest.namedParams[p.id] = {type: p.type, value: p.value};
			});
		}

		const request: IExecuteRequest = {
			id: RandomId.newRandomId(),
			projectId: this.projectContext.projectId,
			commands: [
				sqlCommandRequest,
			],
		};
		const queryId = this.queryId;

		let envState = this.updateEnvState({
			...this.queryState.activeEnv,
			isExecuting: true,
			recordsets: undefined,
		}, this.queryState);
		this.coordinator.execute(this.projectContext.repoId, request)
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: response => {
					console.log('response:', response);
					let recordsets: IRecordsetResult[] = [];

					const mapRecordset = (result: IRecordsetResult) => ({
						result,
						parameters,
						def: this.queryState?.def?.recordsets?.length && this.queryState.def?.recordsets[0]
					});

					const processCommandResponseItem = (item: ICommandResponseItem) => {
						const recordset = (item as ICommandResponseWithRecordset).value;
						if (recordset) {
							recordsets = [...recordsets, recordset];
							this.updateEnvState({
								...this.queryState.environments.find(e => e.id === envState.id),
								recordsets: recordsets.map(mapRecordset),
								isExecuting: false,
							}, this.getQueryState(queryId));
						}
					}
					response.commands.forEach(command => {
						command.items.forEach(processCommandResponseItem);
					});

					envState = this.updateEnvState({
						...envState,
						recordsets: recordsets.map(mapRecordset),
						isExecuting: false,
					}, this.getQueryState(queryId));
				},
				error: err => {
					envState = this.updateEnvState({
						...envState,
						isExecuting: false,
						error: err,
					}, this.getQueryState(queryId));
					this.errorLogger.logError(err, 'Failed to execute query');
				},
			})
	}

	private getQueryState(id: string): IQueryState {
		return this.queryEditorStateService.getQueryState(id);
	}

	private updateEnvState(envState: IQueryEnvState, queryState: IQueryState): IQueryEnvState {
		console.log('updateEnvState', envState);
		if (!envState.id) {
			throw new Error('!envState.id');
		}
		if (queryState.activeEnv.id == envState.id) {
			queryState = {...queryState, activeEnv: envState};
		}
		queryState = {...queryState, environments: queryState.environments.map(env => env.id === envState.id ? envState : env)};
		this.updateQueryState(queryState);
		return envState;
	}

	public saveChanges(): void {
		if (!this.isChanged) {
			alert('Query does not require saving as is not changed yet');
			return;
		}
		this.queryEditorStateService
			.saveQuery(this.queryState, this.currentProject)
			.subscribe({error: this.errorLogger.logErrorHandler('Failed to save query')});
	}

	protected onSqlChanged(sql: string): void {
		if (this.sql === sql) {
			return;
		}
		this.sql = sql;
		try {
			const query = this.queryState.def;
			this.queryAst = this.queryContextSqlService.setSql(this.sql);
			if (query) {
				if (!this.target?.catalog || !query.targets?.find(t => t.catalog === this.target.catalog)) {
					this.target = {
						...(this.target || {}),
						catalog: query.targets?.length && query.targets[0].catalog,
					} as ISqlQueryTarget;
					this.updateQueryContext();
				}
				this.updateQueryState({
					id: this.queryId,
					text: this.sql,
				})
			} else {
				this.updateUrl();
			}
			console.log('this.queryAst:', this.queryAst);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to process onSqlChanged event');
		}
	}

	onSqlAstChanged(change: ISqlChanged): void {
		this.queryAst = change.ast;
		this.onSqlChanged(change.sql);
	}
}
