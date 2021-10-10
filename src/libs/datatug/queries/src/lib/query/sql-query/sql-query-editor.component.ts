import {ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IEnvDbServer, IParameter, IQueryDef, ISqlQueryRequest, ISqlQueryTarget, QueryType} from '@sneat/datatug/models';
import {Coordinator} from '@sneat/datatug/executor';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {EnvironmentService, IAstQuery, SqlParser} from '@sneat/datatug/services/unsorted';
import {
	ICommandResponseItem,
	ICommandResponseWithRecordset,
	IExecuteRequest,
	IRecordsetResult,
	ISqlCommandRequest
} from '@sneat/datatug/dto';
import {RandomIdService} from "@sneat/random";
import {ISqlChanged} from "./intefaces";
import {isQueryChanged, QueryEditorStateService} from "../../query-editor-state-service";
import {DatatugNavContextService, ProjectTracker} from "@sneat/datatug/services/nav";
import {IEnvContext, IProjectContext} from "@sneat/datatug/nav";
import {distinctUntilChanged, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {ViewDidEnter} from "@ionic/angular";
import {IQueryEditorState, IQueryEnvState, IQueryState} from "@sneat/datatug/editor";
import {QueriesService} from '../../queries.service';
import {QueryContextSqlService} from "../../query-context-sql.service";
import {parseStoreRef} from '@sneat/core';


@Component({
	selector: 'datatug-sql-query',
	templateUrl: './sql-query-editor.component.html',
	styleUrls: ['./sql-query-editor.component.scss'],
})
export class SqlQueryEditorComponent implements OnDestroy, ViewDidEnter {

	public showQueryBuilder: boolean;
	public editorTab: 'text' | 'builder' = 'text';

	public editorState: IQueryEditorState = undefined;
	public queryState: IQueryState = {
		id: undefined,
		queryType: QueryType.SQL,
		request: {
			queryType: QueryType.SQL,
			text: '',
		} as ISqlQueryRequest,
	};

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
	public envContext: IEnvContext;
	public envDbServerId: string;
	// noinspection SqlDialectInspection,SqlNoDataSourceInspection
	public sql = '';
	public queryAst: IAstQuery;
	public project: IProjectContext;
	public environments: ReadonlyArray<IQueryEnvState>;
	public dbDriver: 'sqlite3' | 'sqlserver' = 'sqlite3';

	public parameters: IParameter[];
	private target: ISqlQueryTarget;

	public currentProject: IProjectContext;

	private readonly destroyed = new Subject<void>();
	public readonly sqlParser = new SqlParser();
	public readonly trackByIndex = (i: number) => i;

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
		console.log('SqlQueryEditorComponent.constructor()', location.hash);
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
			this.editorState = editorState;
			if (!editorState.currentQueryId) {
				return;
			}
			const queryState = editorState.activeQueries.find(qs => qs.id === editorState.currentQueryId);
			if (!queryState) {
				return;
			}
			console.log('onQueryEditorStateChanged', queryState);
			this.queryState = queryState;
			if (this.sql != (queryState.request as ISqlQueryRequest).text) {
				this.sql = (queryState.request as ISqlQueryRequest).text;
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
			if (queryState.activeEnv?.id && queryState.activeEnv.id !== this.envId) {
				this.envId = queryState?.activeEnv.id;
				this.datatugNavContextService.setCurrentEnvironment(this.envId);
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
					this.currentProject?.ref.projectId === currentProject.ref.projectId
					&& this.currentProject?.ref.storeId === currentProject.ref.storeId
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

	// TODO: Duplicate code
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

	private getEnvData(datatugProjectContext: IProjectContext, envId: string): void {
		const queryId = this.queryId;

		this.envService.getEnvSummary(datatugProjectContext.ref, envId)
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
				console.log('SqlQueryPageComponent.trackQueryParams(): queryParams:', queryParams);
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
		const projectTracker = new ProjectTracker(this.destroyed, this.route);
		projectTracker.projectRef.subscribe({
			next: projectRef => {
				this.project = {ref: projectRef, store: {ref: parseStoreRef(projectRef.storeId)}};
				if (projectRef) {
					this.target = {
						...(this.target || {}),
						repository: projectRef.storeId,
						project: projectRef.projectId,
					} as ISqlQueryTarget;
					console.log('target', this.target);
					this.updateQueryContext();
				}
			},
			error: this.errorLogger.logErrorHandler('Failed to track projectRef from activated router'),
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
			const queryState: IQueryState = {
				isNew,
				id,
				queryType: QueryType.SQL,
				request: {
					queryType: QueryType.SQL,
					text: this.sql
				} as ISqlQueryRequest,
			};
			this.queryEditorStateService.newQuery(queryState);
		} else {
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
		this.updateQueryState(queryState.def === query ? queryState : {
			...queryState,
			isNew: false,
			queryType: query.request.queryType,
			def: query,
			request: {
				queryType: query.request.queryType,
				text: (query.request as ISqlQueryRequest).text,
			} as ISqlQueryRequest,
		});
		this.sql = (query.request as ISqlQueryRequest)?.text;
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
			id: this.queryId,
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
			env: this.activeEnv?.id,
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
			id: this.randomIdService.newRandomId(),
			projectId: this.project.ref.projectId,
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
		this.coordinator.execute(this.project.ref.storeId, request)
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
		queryState = {
			...queryState,
			environments: queryState.environments.map(env => env.id === envState.id ? envState : env)
		};
		this.updateQueryState(queryState);
		return envState;
	}

	public saveChanges(): void {
		if (!this.isChanged) {
			alert('Query does not require saving as is not changed yet');
			return;
		}
		this.queryEditorStateService
			.saveQuery(this.queryState, this.currentProject.ref)
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
					queryType: QueryType.SQL,
					request: {
						queryType: QueryType.SQL,
						text: this.sql,
					} as ISqlQueryRequest,
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
