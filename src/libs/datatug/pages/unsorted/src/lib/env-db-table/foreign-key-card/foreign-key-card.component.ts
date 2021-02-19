import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ICommandResponseWithRecordset, IForeignKey, ITableFull} from '@sneat/datatug/models';
import {DatatugNavService, IDbObjectNavParams} from '@sneat/datatug/services/nav';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {IGridDef} from '@sneat/grid';
import {ProjectService} from '@sneat/datatug/services/project';
import {RepoService} from '@sneat/datatug/services/repo';

@Component({
	selector: 'datatug-fk-card',
	templateUrl: './foreign-key-card.component.html',
	styleUrls: ['./foreign-key-card.component.scss'],
})
export class ForeignKeyCardComponent implements OnChanges {

	@Input() fk: IForeignKey;
	@Input() row: any;
	@Input() tableNavParams: IDbObjectNavParams;
	public grid: IGridDef;
	public table: {
		meta: ITableFull,
		row: any;
	};

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly projectService: ProjectService,
		private readonly datatugNavService: DatatugNavService,
		private readonly repoService: RepoService,
	) {
	}

	public goTable(schema: string, name: string, event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this.datatugNavService.goTable({
			...this.tableNavParams,
			schema: this.fk.refTable.schema,
			name: this.fk.refTable.name,
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.tableNavParams || changes.tableNavParams || changes.row) {
			if (this.fk && this.tableNavParams && this.row) {
				console.log('tableNavParams', this.tableNavParams);
				if (!this.table?.meta) {
					this.projectService.getFull(this.tableNavParams.target)
						.subscribe({
							next: project => {
								console.log('ForeignKeyCardComponent => project:', project);
								// const env = project.environments.find(v => v.id === this.tableNavParams.env);
								// const db = env.dbServer.find(v => v.id === this.tableNavParams.db);
								// const table = db.tables.find(v =>
								//      v.name === this.fk.refTable.name && v.schema === this.fk.refTable.schema);
								// this.table = {
								// 	meta: table,
								// 	row: {[table.primaryKey.columns[0]]: this.row[this.fk.columns[0]]},
								// };
								this.loadData();
							},
							error: err => this.errorLogger.logError(err, 'Failed to get project'),
						})
				} else if (this.row[this.fk.columns[0]] !== this.table.row[this.table.meta.primaryKey.columns[0]]) {
					this.loadData();
				}
			}
		}
	}

	public fkTitle(): string {
		return this.row && this.fk?.columns?.map(c => `${c}=${this.row[c]}`).join(', ');
	}

	private loadData(): void {
		const {schema, name} = this.table.meta;
		this.repoService.select(this.tableNavParams.target.repoId, {
			proj: this.tableNavParams.target.projectId,
			db: this.tableNavParams.db,
			env: this.tableNavParams.env,
			from: `${schema}.${name}`,
			where: `${this.table.meta.primaryKey.columns[0]}:${this.row[this.fk.columns[0]]}`,
		}).subscribe({
			next: response => {
				const itemWithRecordset = response.commands[0].items[0] as ICommandResponseWithRecordset;
				const recordset = itemWithRecordset.value;
				const r = recordset?.rows?.length && recordset.rows[0];
				const row = {};
				recordset.columns.forEach((c, i) => {
					row[c.name] = r[i];
				});
				this.table = {
					...this.table,
					row,
				};
			},
			error: err => this.errorLogger.logError(err, 'Failed to get values'),
		});
	}
}
