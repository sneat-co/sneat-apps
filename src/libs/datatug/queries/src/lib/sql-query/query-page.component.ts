import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {IAstJoin, IAstQuery, SqlParser} from './sql-parser';
import {IProjectContext} from '@sneat/datatug/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ICommandResponseWithRecordset, IExecuteRequest, IQueryDef, ISqlCommandRequest} from '@sneat/datatug/models';
import {Coordinator} from '@sneat/datatug/executor';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {QueriesService} from '@sneat/datatug/services/unsorted';
import {IExecuteResponse, IRecordset} from '@sneat/datatug/dto';
import {RandomId} from '../../../../../random/src/lib/auto-id';

interface IEnvState {
	id: string;
	title?: string;
	isExecuting?: boolean;
	recordsets?: IRecordset[];
	rowsCount?: number;
}

@Component({
	selector: 'datatug-sql-editor',
	templateUrl: './query-page.component.html',
	styleUrls: ['./query-page.component.scss'],
})
export class QueryPage implements AfterViewInit {

	queryTitle = '';
	public query: IQueryDef;
	public queryId: string;
	public envId = 'local';
	public sql = '';
	public colsTab: 'group' | 'order' = 'order';
	public targetCatalog: string;
	public queryAst: IAstQuery;
	public projectContext: IProjectContext;
	public response: IExecuteResponse;
	public environments: IEnvState[] = [
		{id: 'local'},
		{id: 'dev', title: 'Dev'},
		{id: 'sit', title: 'SIT'},
		{id: 'prod', title: 'PROD'},
	]
	public activeEnv?: IEnvState = this.environments.find(v => v.id === this.envId);
	@ViewChild('codemirrorComponent') public codemirrorComponent: CodemirrorComponent;
	public readonly codemirrorOptions = {
		lineNumbers: true,
		readOnly: false,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: {height: 'auto'},
	};
	private readonly sqlParser = new SqlParser();

	public get isChanged(): boolean {
		return (this.query?.title || '') !== this.queryTitle || this.sql !== (this.query?.text || '');
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly route: ActivatedRoute,
		private readonly router: Router,
		private readonly queriesService: QueriesService,
		private readonly coordinator: Coordinator,
	) {
		console.log('QueryPage.constructor()');
		this.query = history.state.query as IQueryDef;
		this.route.paramMap.subscribe({
			next: paramMap => {
				console.log('QueryPage.constructor() => paramMap:', paramMap);
				const queryId = paramMap.get('queryId');
				const projContext: IProjectContext = {
					projectId: paramMap.get('projectId'),
					repoId: paramMap.get('repoId'),
				};
				if (queryId !== this.queryId ||
					projContext.projectId !== this.projectContext.projectId ||
					projContext.repoId !== this.projectContext.repoId) {
					this.projectContext = projContext;
					this.queryId = queryId;
					this.loadQuery();
				}
			},
			error: this.errorLogger.logErrorHandler('Failed to get query params from activated router'),
		});
	}

	ngAfterViewInit(): void {
		// try {
		// 	const {codeMirror} = this.codemirrorComponent;
		// 	codeMirror.getWrapperElement().style.height = 'auto';
		// 	setTimeout(() => codeMirror.refresh(), 9);
		// } catch (e) {
		// 	this.errorLogger.logError(e, 'Failed to setup CodeMirror component');
		// }
	}

	public sqlChanged(sql: string): void {
		console.log('sqlChanged:', sql);
		if (this.sql === sql) {
			return;
		}
		this.sql = sql;
		this.queryAst = this.sqlParser.parseQuery(sql);
	}

	trackByIndex = (i: number) => i;

	joinCheckChanged(event: CustomEvent, join: IAstJoin): void {
		console.log('joinCheckChanged', event, join);
		const checked = !!event.detail.checked;
		if (checked) {
			this.sql = this.sqlParser.uncommentJoin(this.sql, join);
		} else {
			this.sql = this.sqlParser.commentOutJoin(this.sql, join);
		}
		this.queryAst = this.sqlParser.parseQuery(this.sql);
	}

	envChanged(): void {
		this.activeEnv = this.environments.find(v => v.id === this.envId);
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
		const sqlCommandRequest: ISqlCommandRequest = {
			type: 'SQL',
			text: this.sql,
			env: this.envId,
			db: this.query.targets[0].catalog,
		}
		const request: IExecuteRequest = {
			id: RandomId.newRandomId(),
			projectId: this.projectContext.projectId,
			commands: [
				sqlCommandRequest,
			],
		};
		const envState = this.activeEnv;
		envState.isExecuting = true;
		delete envState.recordsets;
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

				envState.recordsets = recordsets;
				envState.isExecuting = false;
				if (sqlCommandRequest.env === this.envId) {
					this.activeEnv = envState;
				}
			},
			error: err => {
				envState.isExecuting = false;
				this.errorLogger.logError(err, 'Failed to execute query')
			},
		})
	}

	public saveChanges(): void {
		alert('Not implemented yet');
	}

	private loadQuery(): void {
		console.log('QueryPage.loadQuery()');
		this.queriesService.getQuery(this.projectContext, this.queryId).subscribe({
			next: query => {
				console.log('QueryPage.loadQuery() => query:', query);
				this.query = query;
				this.queryTitle = query.title;
				this.sql = query.text;
				this.queryAst = this.sqlParser.parseQuery(this.sql);
				if (!this.targetCatalog || !query.targets.find(t => t.catalog === this.targetCatalog)) {
					this.targetCatalog = query.targets?.length && query.targets[0].catalog
				}
				console.log('this.queryAst:', this.queryAst);
			},
			error: this.errorLogger.logErrorHandler('Failed to get query by id'),
		})
	}
}
