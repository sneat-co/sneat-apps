import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	Inject,
	OnDestroy,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { CodemirrorComponent, CodemirrorModule } from '@ctrl/ngx-codemirror';
import { IonicModule, PopoverController } from '@ionic/angular';
import { ProjectService } from '@sneat/datatug-services-project';
import { AgentService } from '@sneat/datatug-services-repo';
import { IForeignKey } from '@sneat/datatug-models';
import {
	DatatugNavContextService,
	DatatugNavService,
	IDbObjectNavParams,
} from '@sneat/datatug-services-nav';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICommandResponseItem,
	ICommandResponseWithRecordset,
	IExecuteResponse,
	IRecordsetResult,
} from '@sneat/datatug-dto';
import { IGridColumn, IGridDef } from '@sneat/grid';
import { IEnvDbTableContext, IProjectContext } from '@sneat/datatug-nav';
import { Subject } from 'rxjs';
import { CellPopoverComponent, DataGridComponent } from '@sneat/datagrid';
import { ColumnComponent } from 'tabulator-tables';
import { ForeignKeyCardComponent } from './foreign-key-card/foreign-key-card.component';

@Component({
	selector: 'sneat-datatug-env-db-table',
	templateUrl: './env-db-table.page.html',
	styleUrls: ['./env-db-table.page.scss'],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		CellPopoverComponent,
		FormsModule,
		ForeignKeyCardComponent,
		CodemirrorModule,
		DataGridComponent,
	],
})
export class EnvDbTablePageComponent implements OnDestroy, AfterViewInit {
	project?: IProjectContext;
	envId?: string;
	dbId?: string;

	public tab: 'grid' | 'record' | 'keys' | 'references' = 'grid';
	public cardTab: 'fks' | 'refs' = 'fks';

	public table?: IEnvDbTableContext;
	public tableNavParams?: IDbObjectNavParams;

	public groupByFk?: string;
	public groupByFks?: IForeignKey[];
	public grid?: IGridDef;
	public currentRow?: {
		index: number;
		data?: Record<string, unknown>;
	};
	public sql = 'select * from';

	@ViewChild('codemirrorComponent')
	public codemirrorComponent?: CodemirrorComponent;

	public readonly codemirrorOptions = {
		lineNumbers: true,
		readOnly: true,
		mode: 'text/x-sql',
		viewportMargin: Infinity,
		style: { height: 'auto' },
	};

	public step = 'initial';
	public recordset?: IRecordsetResult;

	private readonly destroyed = new Subject<void>();

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
		// const projectTracker = new ProjectTracker(this.destroyed, route);
		try {
			const { paramMap } = route.snapshot;
			const [schema, name] = (paramMap.get('tableId') || '').split('.');
			this.table = { schema, name };
			this.envId = paramMap.get('environmentId') || undefined;
			this.dbId = paramMap.get('dbId') || undefined;
			if (this.envId && this.dbId && this.project) {
				this.tableNavParams = {
					project: this.project,
					env: this.envId,
					db: this.dbId,
					schema,
					name,
				};
			}

			this.datatugNavContextService.currentProject.subscribe({
				next: (currentProject) => {
					console.log(
						'EnvDbTablePage.constructor() => currentProject',
						currentProject,
					);
					try {
						this.project = currentProject;
					} catch (e) {
						this.errorLogger.logError(e, 'Failed to process current project');
					}
				},
				error: (err) =>
					this.errorLogger.logError(
						err,
						'EnvDbTablePage: failed to get current project',
					),
			});
			this.datatugNavContextService.currentEnvDbTable.subscribe({
				next: (currentTable) => {
					console.log('EnvDbTablePage => currentTable:', currentTable);
					try {
						this.table = currentTable;
						if (!currentTable) {
							return;
						}
						this.groupByFks = currentTable.meta?.foreignKeys?.filter(
							(fk) => fk.columns.length === 1,
						);
						const from =
							currentTable.schema === 'dbo'
								? currentTable.name
								: `${currentTable.schema}.${currentTable.name}`;
						this.sql = `select *
from ${from}`;
						console.log('sql:', this.sql, currentTable);
						// this.codemirrorComponent?.codeMirror?.refresh();
						if (currentTable.meta) {
							this.grid = {
								columns:
									this.table?.meta?.columns?.map((col) => ({
										field: col.name,
										title: col.name,
										dbType: col.dbType,
									})) || [],
							};
							this.loadData();
						}
					} catch (e) {
						this.errorLogger.logError(e, 'Failed to process current table');
					}
				},
				error: (err) =>
					this.errorLogger.logError(err, 'Failed to get current table context'),
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to create EnvDbTablePage');
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngAfterViewInit(): void {
		if (!this.codemirrorComponent) {
			return;
		}
		try {
			const { codeMirror } = this.codemirrorComponent;
			if (codeMirror) {
				codeMirror.getWrapperElement().style.height = 'auto';
				setTimeout(() => codeMirror.refresh(), 9);
			}
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

	public setCurrentRow(index: number, data?: Record<string, unknown>): void {
		console.log('setCurrentRow()', index, data);
		try {
			if (!data) {
				const rows = this.grid?.rows;
				data = rows && rows[index];
			}
			this.currentRow = { index, data };
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to set current row');
		}
	}

	public onGroupByFkChanged(event: Event): void {
		console.log('onGroupByFkChanged()', event);
		this.setupGrid();
	}

	goTable(schema: string, name: string, event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		if (!this.project || !this.envId || !this.dbId) {
			return;
		}
		this.datatugNavService.goTable({
			project: this.project,
			env: this.envId,
			db: this.dbId,
			schema,
			name,
		});
	}

	protected colValue(colName: string): string {
		return this.currentRow?.data ? '' + this.currentRow.data[colName] : '';
	}

	private cellFormatter = (
		cell: {
			getValue: () => unknown;
			getElement: () => HTMLElement;
			getColumn: () => ColumnComponent;
		},
		formatterParams: unknown,
		onRendered: (f: () => void) => void,
	) => {
		try {
			const value = cell.getValue();
			onRendered(() => {
				try {
					const el: HTMLElement = cell.getElement();
					const colDef = cell.getColumn().getDefinition();
					const { field } = colDef;
					const fk = field ? this.getColFk(field) : undefined;
					const col = this.table?.meta?.columns?.find((c) => c.name === field);
					// console.log('cellFormatter', field, value, colDef, col);
					if (col?.dbType === 'uniqueidentifier') {
						el.style.fontSize = 'smaller';
					}
					if (fk) {
						el.style.color = 'blue';
						el.onclick = (event) => {
							console.log('Mouse clicked: ' + value, colDef, colDef.field);
							this.popoverController
								.create({
									component: CellPopoverComponent,
									event,
									componentProps: { column: { name: colDef.field }, value, fk },
									cssClass: 'cell-popover',
									// showBackdrop: false,
								})
								.then((p) => {
									p.present().catch((e) =>
										this.errorLogger.logError(
											e,
											'Failed to present cell popover',
										),
									);
								})
								.catch((e) =>
									this.errorLogger.logError(
										e,
										'Failed to present cell popover',
									),
								);
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
		return this.table?.meta?.foreignKeys?.find((v) =>
			v.columns.includes(field),
		);
	}

	private loadData(): void {
		console.log('EnvDbTablePage.loadData()', this.table);
		if (!this.project || !this.envId || !this.dbId || !this.table?.meta?.name) {
			return;
		}
		try {
			this.step = 'loadData';
			this.agentService
				.select(this.project?.ref.storeId, {
					proj: this.project?.ref?.projectId,
					env: this.envId,
					db: this.dbId,
					from: this.table.meta.name,
					limit: 100,
				})
				.pipe(first())
				.subscribe({
					next: (response) => {
						this.step = 'got response';
						this.processResponse(response);
					},
					error: (err) =>
						this.errorLogger.logError(err, 'Failed to select from table'),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to load data');
		}
	}

	private processResponse = (response: IExecuteResponse): void => {
		console.log('processResponse()', response);
		try {
			this.step = 'processResponse';
			const firstCommand = response.commands?.length
				? response.commands[0]
				: undefined;
			const firstItem = (firstCommand?.items as ICommandResponseItem[])[0];
			const itemWithRecordset = firstItem as ICommandResponseWithRecordset;
			this.recordset = itemWithRecordset?.value;
			this.setupGrid();
			console.log('Grid was set up', 'grid:', this.grid);
		} catch (ex) {
			this.errorLogger.logError(ex, 'Failed to process response');
		}
	};

	private setupGrid(): void {
		console.log('setupGrid()', this, this.recordset);
		this.step = 'setupGrid';
		const cols = this.recordset?.columns;
		if (!cols) {
			throw new Error('!cols');
		}
		try {
			const groupBy =
				this.groupByFk &&
				this.table?.meta?.foreignKeys?.find((fk) => fk.name === this.groupByFk)
					?.columns[0];
			this.grid = {
				groupBy,
				columns: cols
					.filter((c) => c.name !== groupBy)
					.map((c) => {
						const col: IGridColumn = {
							field: c.name,
							dbType: c.dbType,
							title: c.title || c.name,
							// sortable: true,
							// tooltip: (cell: CellComponent) =>
							// 	// function should return a string for the tooltip of false to hide the tooltip
							// 	`${cell.getColumn().getField()}: ${cell.getValue()}`, // return cells "field - value";
							// formatter:
							// 	(c.dbType === 'UNIQUEIDENTIFIER' || this.getColFk(c.name)) &&
							// 	this.cellFormatter,
							hozAlign: c.dbType === 'integer' ? 'right' : undefined,
						};
						return col;
					}),
				rows: this.recordset?.rows.map((row) => {
					const r: Record<string, unknown> = {};
					cols?.forEach((col, i) => (r[col.name] = row[i]));
					return r;
				}),
			};
			console.log('grid:', this.grid);
			const gridRows = this.grid?.rows;
			const l = this.grid?.rows?.length;
			if (gridRows && l) {
				const index = Math.min(this.currentRow?.index || 0, l - 1);
				const data = gridRows[index];
				this.setCurrentRow(index, data);
			}
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to setup grid');
		}
	}
}
