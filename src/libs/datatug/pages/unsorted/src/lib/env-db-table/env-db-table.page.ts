import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {first} from 'rxjs/operators';
import {CodemirrorComponent} from '@ctrl/ngx-codemirror';
import {PopoverController} from '@ionic/angular';
import {IDatatugProjRef} from '@sneat/datatug/core';
import {ProjectService} from '@sneat/datatug/services/project';
import {AgentService} from '@sneat/datatug/services/repo';
import {IForeignKey} from '@sneat/datatug/models';
import {DatatugNavContextService, DatatugNavService, IDbObjectNavParams} from '@sneat/datatug/services/nav';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {CellPopoverComponent} from '../../../../../components/datagrid/src/lib/cell-popover/cell-popover.component';
import {ICommandResponseWithRecordset, IExecuteResponse, IRecordsetResult} from '@sneat/datatug/dto';
import {IGridDef} from '@sneat/grid';
import {IEnvDbTableContext} from '@sneat/datatug/nav';

@Component({
	selector: 'datatug-env-db-table',
	templateUrl: './env-db-table.page.html',
	styleUrls: ['./env-db-table.page.scss'],
})
export class EnvDbTablePageComponent implements AfterViewInit {

	target: IDatatugProjRef;
	storeId: string;
	projectId: string;
	envId: string;
	dbId: string;

	public tab: 'grid' | 'record' | 'keys' | 'references' = 'grid';
	public cardTab: 'fks' | 'refs' = 'fks';

	public table: IEnvDbTableContext;
	public tableNavParams: IDbObjectNavParams;

	public groupByFk: string;
	public groupByFks: IForeignKey[];
	public grid: IGridDef;
	public currentRow: {
		index: number;
		data?: any;
	} = {index: 0};
	public sql = 'select * from';

	@ViewChild('codemirrorComponent') public codemirrorComponent: CodemirrorComponent;

	public readonly codemirrorOptions = {
		lineNumbers: true,
		readOnly: true,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: {height: 'auto'},
	};

	public step = 'initial';
	public recordset: IRecordsetResult;

	constructor(
		private readonly datatugNavContextService: DatatugNavContextService,
		private readonly route: ActivatedRoute,
		private readonly projService: ProjectService,
		private readonly agentService: AgentService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly datatugNavService: DatatugNavService,
	) {
		console.log('EnvDbTablePage.constructor()', errorLogger);
		try {
			const {paramMap} = route.snapshot;
			const [schema, name] = paramMap.get('tableId').split('.');
			this.table = {schema, name};
			this.envId = paramMap.get('environmentId');
			this.dbId = paramMap.get('dbId');
			const [projectId, agentAddress] = paramMap.get('projectId').split('@');
			this.target = {projectId, storeId: agentAddress};
			this.tableNavParams = {
				target: this.target,
				env: this.envId,
				db: this.dbId,
				schema,
				name,
			};
			this.datatugNavContextService.currentProject.subscribe({
				next: currentProject => {
					console.log('EnvDbTablePage.constructor() => currentProject', currentProject);
					try {
						this.target = {projectId: currentProject?.brief?.id, storeId: currentProject?.storeId};
					} catch (e) {
						this.errorLogger.logError(e, 'Failed to process current project');
					}
				},
				error: err => this.errorLogger.logError(err, 'EnvDbTablePage: failed to get current project'),
			})
			this.datatugNavContextService.currentEnvDbTable.subscribe({
				next: currentTable => {
					console.log('EnvDbTablePage => currentTable:', currentTable);
					try {
						this.table = currentTable;
						if (!currentTable) {
							return;
						}
						this.groupByFks = currentTable.meta?.foreignKeys?.filter(fk => fk.columns.length === 1);
						const from = currentTable.schema === 'dbo' ? currentTable.name : `${currentTable.schema}.${currentTable.name}`
						this.sql = `select *
from ${from}`;
						console.log('sql:', this.sql, currentTable);
						// this.codemirrorComponent?.codeMirror?.refresh();
						if (currentTable.meta) {
							this.grid = {
								columns: this.table.meta.columns.map(col => ({
									field: col.name,
									title: col.name,
									dbType: col.dbType,
								})),
							};
							this.loadData();
						}
					} catch (e) {
						this.errorLogger.logError(e, 'Failed to process current table');
					}
				},
				error: err => this.errorLogger.logError(err, 'Failed to get current table context'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to create EnvDbTablePage')
		}
	}

	ngAfterViewInit(): void {
		try {
			const {codeMirror} = this.codemirrorComponent;
			codeMirror.getWrapperElement().style.height = 'auto';
			setTimeout(() => codeMirror.refresh(), 9);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup CodeMirror component');
		}
	}

	public tabChanged(event: Event): void {
		console.log('tab changed:', this.tab, event);
	}

	// public selectRow(event: RowDoubleClickedEvent): void {
	// 	console.log('selectRow', event);
	// 	this.setCurrentRow(event.rowIndex, event.data);
	// 	this.tab = 'record';
	// }

	public setCurrentRow(index: number, data?: any): void {
		console.log('setCurrentRow()', index, data);
		try {
			if (!data) {
				data = this.grid.rows[index];
			}
			this.currentRow = {index, data};
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to set current row');
		}
	}

	public onGroupByFkChanged(_: Event): void {
		console.log('onGroupByFkChanged()');
		this.setupGrid();
	}

	goTable(schema: string, name: string, event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.datatugNavService
			.goTable({
				target: this.target,
				env: this.envId,
				db: this.dbId,
				schema,
				name,
			});
	}

	private cellFormatter = (cell, formatterParams, onRendered) => {
		try {
			const value = cell.getValue();
			onRendered(() => {
				try {
					const el: HTMLElement = cell.getElement();
					const colDef = cell.getColumn().getDefinition();
					const {field} = colDef;
					const fk = this.getColFk(field);
					const col = this.table.meta.columns.find(c => c.name === field);
					// console.log('cellFormatter', field, value, colDef, col);
					if (col?.dbType === 'uniqueidentifier') {
						el.style.fontSize = 'smaller';
					}
					if (fk) {
						el.style.color = 'blue';
						el.onclick = event => {
							console.log('Mouse clicked: ' + value, colDef, colDef.field);
							this.popoverController.create({
								component: CellPopoverComponent,
								event,
								componentProps: {column: {name: colDef.field}, value, fk},
								cssClass: 'cell-popover',
								// showBackdrop: false,
							}).then(p => {
								p.present().catch(e => this.errorLogger.logError(e, 'Failed to present cell popover'));
							}).catch(e => this.errorLogger.logError(e, 'Failed to present cell popover'));
						};
					}
				} catch (e) {
					this.errorLogger.logError(e, 'Failed to alter rendered cell');
				}
			});
			return value;
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to render cell');
			return '' + e;
		}
	};

	private getColFk(field: string) {
		return this.table.meta?.foreignKeys?.find(v => v.columns.indexOf(field) >= 0);
	}

	private loadData(): void {
		console.log('EnvDbTablePage.loadData()', this.table);
		try {
			this.step = 'loadData';
			this.agentService
				.select(this.target.storeId, {
					proj: this.projectId,
					env: this.envId,
					db: this.dbId,
					from: this.table.meta.name,
					limit: 100,
				})
				.pipe(first())
				.subscribe({
					next: response => {
						this.step = 'got response';
						this.processResponse(response);
					},
					error: err => this.errorLogger.logError(err, 'Failed to select from table'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to load data');
		}
	}

	private processResponse = (response: IExecuteResponse): void => {
		console.log('processResponse()', response);
		try {
			this.step = 'processResponse';
			const itemWithRecordset = response.commands[0].items[0] as ICommandResponseWithRecordset
			this.recordset = itemWithRecordset?.value;
			this.setupGrid();
			console.log('Grid was set up', 'grid:', this.grid);
		} catch (ex) {
			this.errorLogger.logError(ex, 'Failed to process response');
		}
	}

	private setupGrid(): void {
		console.log('setupGrid()', this, this.recordset);
		this.step = 'setupGrid';
		try {
			const cols = this.recordset.columns;
			const groupBy = this.groupByFk && this.table?.meta?.foreignKeys?.find(fk => fk.name === this.groupByFk).columns[0];
			this.grid = {
				groupBy,
				columns: cols
					.filter(c => c.name !== groupBy)
					.map(c => {
						const col: any = {
							field: c.name,
							dbType: c.dbType,
							title: c.title || c.name,
							sortable: true,
							tooltip: cell =>
								// function should return a string for the tooltip of false to hide the tooltip
								`${cell.getColumn().getField()}: ${cell.getValue()}` // return cells "field - value";
							,
							formatter: (c.dbType === 'UNIQUEIDENTIFIER' || this.getColFk(c.name)) && this.cellFormatter,
						};
						if (c.dbType === 'integer') {
							col.hozAlign = 'right';
						}
						return col;
					}),
				rows: this.recordset.rows.map(row => {
					const r = {};
					cols.forEach((col, i) => r[col.name] = row[i]);
					return r
				}),
			};
			console.log('grid:', this.grid);
			if (this.grid?.rows?.length) {
				const index = Math.min(this.currentRow.index, this.recordset.rows.length - 1);
				this.setCurrentRow(index, this.grid.rows[index]);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup grid');
		}
	}
}
