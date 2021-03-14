import {Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
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
	public sql = '';
	public colsTab: 'group' | 'order' = 'order';
	public queryAst: IAstQuery;
	public projectContext: IDatatugProjRef;
	public response: IExecuteResponse;
	public environments: IEnvState[];
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
				const {id} = currentEnv;
				if (!id) {
					return
				}
				this.envId = id
				this.activeEnv = this.environments.find(env => env.id === id)
			});
	}

	private trackCurrentProject(): void {
		this.datatugNavContextService.currentProject
			.pipe(takeUntil(this.destroyed))
			.subscribe(currentProject => {
				console.log('SqlQueryPage => currentProject:', currentProject)
				this.currentProject = currentProject;
				const summary = currentProject?.summary;
				if (summary) {
					this.environments = summary.environments;
					if (summary.environments?.length) {
						const envId = summary.environments[0].id;
						this.envId = envId;
						this.envService.getEnvSummary(this.projectContext, envId)
							.pipe(takeUntil(this.destroyed))
							.subscribe(envSummary => {
								if (this.envId == envId) {
									this.envDbServers = envSummary.dbServers;
									this.activeEnv = {
										...this.activeEnv,
										summary: envSummary,
									}
								}
							});
					}
					if (summary.dbModels?.length === 1) {
						this.targetDbModelId = summary.dbModels[0].id;
					}
				}
			});
	}

	private trackQueryParams(): void {
		this.route.queryParamMap.subscribe({
			next: queryParams => {
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
				const queryId = paramMap.get('queryId');
				this.queryEditorStateService.openQuery(queryId);
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
		console.log('sqlChanged:', sql);
		if (this.sql === sql) {
			return;
		}
		this.sql = sql;
		this.queryAst = this.queryContextSqlService.setSql(sql)
	}

	trackByIndex = (i: number) => i;

	serverChanged(): void {
		this.activeEnv = {
			...this.activeEnv,
			dbServerId: this.envDbServerId,
		};
	}

	envChanged(): void {
		this.activeEnv = this.environments.find(v => v.id === this.envId);

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
		this.executeQuery();
	}

	executeQuery(): void {
		if (!this.targetCatalog) {
			alert('select target catalog 1st');
			return;
		}
		const sqlCommandRequest: ISqlCommandRequest = {
			type: 'SQL',
			text: this.sql,
			env: this.envId,
			db: this.targetCatalog,
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
		this.coordinator.execute(this.projectContext.repoId, request).subscribe({
			next: response => {
				console.log('response:', response);
				this.response = response;
				const recordsets: IRecordset[] = [];

				response.commands.forEach(command => {
					command.items.forEach(item => {
						const recordset = (item as ICommandResponseWithRecordset).value;
						if (recordset) {
							recordsets.push(recordset)
						}
					});
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
		if (this.activeEnv.id === envState.id) {
			this.activeEnv = envState;
		}
		if (this.environments.find(env => env.id === envState.id)) {
			this.environments = this.environments.map(env => env.id === envState.id ? envState : env);
		} else {
			this.environments.push(envState);
		}
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
		console.log('this.queryAst:', this.queryAst);
	}

	private loadQuery(queryId: string): void {
		console.log('QueryPage.loadQuery()', queryId);
		this.queriesService.getQuery(this.projectContext, this.queryId).subscribe({
			next: query => {
				console.log('QueryPage.loadQuery() => query:', query);
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
