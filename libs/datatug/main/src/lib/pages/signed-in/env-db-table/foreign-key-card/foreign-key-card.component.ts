import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import {
	IonBadge,
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonInput,
	IonItem,
	IonLabel,
	IonText,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IGridDef } from '@sneat/grid';
import { ICommandResponseWithRecordset } from '../../../../dto/response';
import {
	IForeignKey,
	ITableFull,
	ITableRef,
} from '../../../../models/definition/apis/database';
import {
	DatatugNavService,
	IDbObjectNavParams,
} from '../../../../services/nav/datatug-nav.service';
import { ProjectService } from '../../../../services/project/project.service';
import { AgentService } from '../../../../services/repo/agent.service';

@Component({
	selector: 'sneat-datatug-fk-card',
	templateUrl: './foreign-key-card.component.html',
	styleUrls: ['./foreign-key-card.component.scss'],
	imports: [
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonText,
		IonItem,
		IonLabel,
		IonInput,
		IonBadge,
	],
})
export class ForeignKeyCardComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly projectService = inject(ProjectService);
	private readonly datatugNavService = inject(DatatugNavService);
	private readonly agentService = inject(AgentService);

	@Input() fk?: IForeignKey;
	@Input() row?: Record<string, unknown>;
	@Input() tableNavParams?: IDbObjectNavParams;
	public grid?: IGridDef;
	public table?: {
		meta: ITableFull;
		row: Record<string, unknown>;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public goTable(event: Event, tableRef?: ITableRef): void {
		event.preventDefault();
		event.stopPropagation();
		throw new Error('not implemented yet');
		// this.datatugNavService.goTable({
		// 	...this.tableNavParams,
		// 	schema: this.fk.refTable.schema,
		// 	name: this.fk.refTable.name,
		// });
	}

	protected colValue(colName: string): string {
		return '' + this.table?.row[colName];
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['tableNavParams'] || changes['row'] || changes['fk']) {
			if (this.fk && this.tableNavParams && this.row) {
				console.log('tableNavParams', this.tableNavParams);
				if (!this.table?.meta) {
					this.projectService
						.getFull(this.tableNavParams.project.ref)
						.subscribe({
							next: (project) => {
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
							error: (err) =>
								this.errorLogger.logError(err, 'Failed to get project'),
						});
				} else if (
					!this.table.meta.primaryKey ||
					this.row[this.fk.columns[0]] !==
						this.table.row[this.table.meta.primaryKey.columns[0]]
				) {
					this.loadData();
				}
			}
		}
	}

	public fkTitle(): string | undefined {
		return (
			this.row &&
			this.fk?.columns?.map((c) => `${c}=${this.row && this.row[c]}`).join(', ')
		);
	}

	private loadData(): void {
		if (
			!this.table?.meta ||
			!this.tableNavParams?.db ||
			!this.tableNavParams.env ||
			!this.row ||
			!this.fk?.columns?.length
		) {
			return;
		}
		const { schema, name } = this.table.meta;
		this.agentService
			.select(this.tableNavParams.project.ref.storeId, {
				proj: this.tableNavParams.project.ref.projectId,
				db: this.tableNavParams?.db,
				env: this.tableNavParams?.env,
				from: `${schema}.${name}`,
				where: `${this.table.meta.primaryKey?.columns[0]}:${
					(this.row as Record<string, unknown>)[this.fk.columns[0]]
				}`,
			})
			.subscribe({
				next: (response) => {
					const firstCommand = response.commands[0];
					const firstItem = firstCommand.items?.length
						? firstCommand.items[0]
						: undefined;
					const itemWithRecordset = firstItem as ICommandResponseWithRecordset;
					const recordset = itemWithRecordset.value;
					const r = recordset.rows[0];
					const row: Record<string, unknown> = {};
					recordset.columns.forEach((c, i) => (row[c.name] = r[i]));
					if (this.table) {
						this.table = {
							...this.table,
							row,
						};
					}
				},
				error: (err) => this.errorLogger.logError(err, 'Failed to get values'),
			});
	}
}
