import {ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
	ICommandResponseItem,
	ICommandResponseWithRecordset,
	IEnvDbServer,
	IEnvironmentSummary,
	IExecuteRequest,
	IProjEnv,
	IQueryDef,
	ISqlCommandRequest
} from '@sneat/datatug/models';
import {Coordinator} from '@sneat/datatug/executor';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {
	EnvironmentService,
	IAstQuery,
	ICanJoin,
	ISqlQueryTarget,
	QueriesService,
	QueryContextSqlService,
	SqlParser
} from '@sneat/datatug/services/unsorted';
import {IExecuteResponse, IRecordset} from '@sneat/datatug/dto';
import {RandomId} from "@sneat/random";
import {ISqlChanged} from "./intefaces";
import {QueryEditorStateService} from "@sneat/datatug/queries";
import {QueriesMenuComponent} from "../../queries-menu.component";
import {DatatugNavContextService} from "@sneat/datatug/services/nav";
import {IDatatugProjectContext} from "@sneat/datatug/nav";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

interface IEnvState {
	readonly id: string;
	readonly title?: string;
	readonly summary?: IEnvironmentSummary;
	readonly isExecuting?: boolean;
	readonly recordsets?: IRecordset[];
	readonly rowsCount?: number;
	readonly dbServerId?: string;
	readonly dbServer?: IEnvDbServer;
	readonly catalogId?: string;
	readonly error?: any
}

function getEnvBriefFromEnvState(envState: IEnvState): IProjEnv {
	return {id: envState.id, title: envState.title};
}

@Component({
	selector: 'datatug-sql-editor',
	templateUrl: './sql-query-page.component.html',
	styleUrls: ['./sql-query-page.component.scss'],
})
export class SqlQueryPageComponent implements OnDestroy {

	public readonly contextMenuComponent = QueriesMenuComponent;

	public targetDbModelId: string;
	public queryMode: 'text' | 'builder' = 'text';

	queryTitle = '';
	public queryNamePlaceholder: string;
	public targetCatalog: string;
	public query: IQueryDef;
	public queryId: string;
	public envId;
	public envDbServerId: string;
	public sql = 'select * from Album';
	public colsTab: 'group' | 'order' = 'order';
	public queryAst: IAstQuery;
	public projectContext: IDatatugProjRef;
	public response: IExecuteResponse;
	public environments: IEnvState[];
	public dbDriver: 'sqlite3' | 'sqlserver' = 'sqlite3';
	public envDbServers: IEnvDbServer[];
	public activeEnv?: IEnvState;
	@ViewChild('codemirrorComponent') public codemirrorComponent: CodemirrorComponent;
	public readonly codemirrorOptions = {
		lineNumbers: true,
		readOnly: false,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: {height: 'auto'},
	};
	public readonly sqlParser = new SqlParser();
	private target: ISqlQueryTarget;

	public currentProject: IDatatugProjectContext;

	private destroyed = new Subject<void>();

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
		const query = history.state.query as IQueryDef;
		if (query) {
			this.setQuery(query);
		}

		if (location.hash.startsWith('#text=')) {
			this.sql = decodeURIComponent(location.hash.substr(6).replace(/\+/g, '%20'));
			this.onSqlChanged();
		}

		this.trackCurrentEnv();
		this.trackCurrentProject()
		this.trackQueryParams();
		this.trackParamMap();
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	private trackCurrentEnv(): void {
		this.datatugNavContextService.currentEnv
			.pipe(takeUntil(this.destroyed))
			.subscribe(currentEnv => {
				try {
					if (!currentEnv) {
						return;
					}
					const {id} = currentEnv;
					if (!id) {
						return;
					}
					this.envId = id
					this.activeEnv = this.environments?.find(env => env.id === id) || {id, summary: currentEnv.summary};
				} catch (e) {
					this.errorLogger.logError(e, 'Failed to process change of current environment');
				}
			});
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
					return;
				}
				this.currentProject = currentProject;
				const summary = currentProject?.summary;
				if (!summary) {
					return;
				}
				this.environments = summary.environments?.map(env => {
					const envState = this.environments?.find(e => e.id === env.id);
					if (envState) {
						return envState;
					}
					return env;
				});
				if (summary.environments?.length) {
					const envId = summary.environments[0].id;
					this.activeEnv = {id: envId};
					this.getEnvData(currentProject, envId);
					if (summary.dbModels?.length === 1) {
						this.targetDbModelId = summary.dbModels[0].id;
					}
				}
			});
	}

	private getEnvData(datatugProjectContext: IDatatugProjectContext, envId: string): void {
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
					if (this.envId === envId) {
						this.envDbServers = envSummary.dbServers;
						let envState = {
							...this.activeEnv,
							summary: envSummary,
						};
						if (envSummary.dbServers?.length) {
							const envDbServer = envSummary.dbServers[0];
							envState = {
								...envState,
								dbServer: envDbServer,
								dbServerId: this.getDbServerId(envDbServer),
								catalogId: envDbServer.catalogs?.length && envDbServer.catalogs[0],
							}
						}
						this.updateEnvState(envState);
					} else {
						console.log('Environment changed', envId, this.envId);
					}
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
				const envId = queryParams.get('env');
				if (envId) {
					this.envId = envId;
					if (this.activeEnv?.id !== envId) {
						this.activeEnv = this.environments?.find(env => env.id === envId) || {id: envId};
					}
				}
				this.target = {
					...(this.target || {}),
					server: queryParams.get('server'),
					catalog: queryParams.get('catalog'),
					driver: queryParams.get('driver') || 'sqlserver',
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

				let queryId = paramMap.get('queryId');
				if (queryId) {
					this.queryEditorStateService.openQuery(queryId);
				}

				const projContext: IDatatugProjRef = {
					projectId: paramMap.get('projectId'),
					repoId: paramMap.get('repoId'),
				};
				this.projectContext = projContext;
				if (projContext.repoId && projContext.projectId) {
					this.target = {
						...(this.target || {}),
						repository: projContext.repoId,
						project: projContext.projectId,
					} as ISqlQueryTarget;
					console.log('target', this.target);
					this.updateQueryContext();
				}
				if (queryId && (
					queryId !== this.queryId ||
					projContext.projectId !== this.projectContext?.projectId ||
					projContext.repoId !== this.projectContext?.repoId
				)) {
					this.queryId = queryId;
					this.loadQuery(queryId);
				} else if (!queryId) {
					queryId = RandomId.newRandomId();
					this.queryEditorStateService.newQuery({id: queryId});
					this.queryId = queryId;
					if (!this.sql) {
						this.sql = 'select' + ' * ' + 'from ';
						this.onSqlChanged();
					}
				}

				this.queryNamePlaceholder = queryId ? 'Name is required field' : 'New query - type name here to save';
			},
			error: this.errorLogger.logErrorHandler('Failed to get query params from activated router'),
		});

	}

	private setQuery(query: IQueryDef): void {
		this.query = query;
		this.queryTitle = query.title;
		this.sql = query.text;
		if (query.targets?.length && !this.targetCatalog) {
			this.targetCatalog = query.targets[0].catalog;
		}
		this.onSqlChanged();
	}

	private updateQueryContext(): void {
		console.log('updateQueryContext()', this.target);
		if (this.target.repository && this.target.project && this.target.driver && this.target.server && this.target.catalog) {
			this.queryContextSqlService.setTarget(this.target);
		}
	}

	public get isChanged(): boolean {
		return (this.query?.title || '') !== this.queryTitle || this.sql !== (this.query?.text || '');
	}

	// ngAfterViewInit(): void {
	// 	// try {
	// 	// 	const {codeMirror} = this.codemirrorComponent;
	// 	// 	codeMirror.getWrapperElement().style.height = 'auto';
	// 	// 	setTimeout(() => codeMirror.refresh(), 9);
	// 	// } catch (e) {
	// 	// 	this.errorLogger.logError(e, 'Failed to setup CodeMirror component');
	// 	// }
	// }

	public sqlChanged(sql: string): void {
		// console.log('sqlChanged:', sql);
		if (this.sql === sql) {
			return;
		}
		this.sql = sql;
		if (sql) {
			this.queryAst = this.queryContextSqlService.setSql(sql)
		}
	}

	trackByIndex = (i: number) => i;

	serverChanged(event: CustomEvent): void {
		if (event.detail.value === this.activeEnv?.dbServerId) {
			return
		}
		this.updateEnvState({
			...this.activeEnv,
			dbServerId: this.envDbServerId,
		});
	}

	catalogChanged(event: CustomEvent): void {
		console.log('catalogChanged', event.detail.value, this.activeEnv?.catalogId);
		if (event.detail.value === this.activeEnv?.catalogId) {
			return
		}
		this.updateEnvState({
			...this.activeEnv,
			catalogId: event.detail.value,
		});
	}

	envChanged(): void {
		this.activeEnv = this.environments.find(v => v.id === this.envId);
		if (!this.activeEnv.summary) {
			this.getEnvData(this.currentProject, this.activeEnv.id);
		}

		this.datatugNavContextService.setCurrentEnvironment(this.envId);
		const queryParams: Params = {
			env: this.envId,
		};

		this.router.navigate(
			[],
			{
				relativeTo: this.route,
				queryParams,
				queryParamsHandling: 'merge', // remove to replace all query params by provided
			}).catch(this.errorLogger.logErrorHandler('Failed to change query parameter'));
	}

	executeFromTab(event: Event, env: IEnvState): void {
		event.preventDefault();
		event.stopPropagation();
		this.activeEnv = env;
		this.envId = env.id;
		this.updateEnvState(env);
		setTimeout(() => this.executeQuery(), 10);


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
		}
		const request: IExecuteRequest = {
			id: RandomId.newRandomId(),
			projectId: this.projectContext.projectId,
			commands: [
				sqlCommandRequest,
			],
		};
		let envState = this.updateEnvState({
			...this.activeEnv,
			isExecuting: true,
			recordsets: undefined,
		});
		this.environments = this.environments.map(e => e.id === envState.id ? envState : e);
		this.coordinator.execute(this.projectContext.repoId, request)
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: response => {
					console.log('response:', response);
					this.response = response;
					let recordsets: IRecordset[] = [];

					const processCommandResponseItem = (item: ICommandResponseItem) => {
						const recordset = (item as ICommandResponseWithRecordset).value;
						if (recordset) {
							recordsets = [...recordsets, recordset];
							this.updateEnvState({
								...this.environments.find(e => e.id === envState.id),
								recordsets,
								isExecuting: false,
							})
						}
					}
					response.commands.forEach(command => {
						command.items.forEach(processCommandResponseItem);
					});

					envState = this.updateEnvState({
						...envState,
						recordsets: recordsets,
						isExecuting: false,
					});
					if (this.activeEnv.id === envState.id) {
						this.activeEnv = envState;
					}
					if (sqlCommandRequest.env === this.envId) {
						this.activeEnv = envState;
					}
				},
				error: err => {
					envState = this.updateEnvState({
						...envState,
						isExecuting: false,
						error: err,
					})
					this.errorLogger.logError(err, 'Failed to execute query')
				},
			})
	}

	private updateEnvState(envState: IEnvState): IEnvState {
		console.log('updateEnvState', envState);
		if (!envState.id) {
			throw new Error('!envState.id');
		}
		if (this.activeEnv?.id === envState?.id) {
			this.activeEnv = envState;
		}
		this.environments = this.environments?.map(env => env.id === envState.id ? envState : env);
		// if (this.environments.find(env => env.id === envState.id)) {
		//
		// } else {
		// 	this.environments.push(envState);
		// }
		this.changeDetector.markForCheck();
		return envState;
	}

	public saveChanges(): void {
		alert('Not implemented yet');
	}

	public addJoin(sj: ICanJoin, joinType: 'inner' | 'right' | 'left'): void {
		alert('Sorry, not implemented yed');
	}

	protected onSqlChanged(): void {
		const query = this.query;
		this.queryAst = this.queryContextSqlService.setSql(this.sql);
		if (query) {
			if (!this.target?.catalog || !query.targets?.find(t => t.catalog === this.target.catalog)) {
				this.target = {
					...(this.target || {}),
					catalog: query.targets?.length && query.targets[0].catalog,
				} as ISqlQueryTarget;
				this.updateQueryContext();
			}
		}
		this.queryEditorStateService.updateQueryState({id: this.queryId, title: query.text})
		console.log('this.queryAst:', this.queryAst);
	}

	private loadQuery(queryId: string): void {
		console.log('QueryPage.loadQuery()', queryId);
		this.queriesService.getQuery(this.projectContext, this.queryId).subscribe({
			next: query => {
				console.log('QueryPage.loadQuery() => query:', query);
				if (!query.type) {
					this.errorLogger.logError('received a query with unknown type');
					return;
				}
				this.setQuery(query)
			},
			error: this.errorLogger.logErrorHandler('Failed to get query by id'),
		})
	}

	onSqlAstChanged(change: ISqlChanged): void {
		this.sql = change.sql;
		this.queryAst = change.ast;
	}
}
