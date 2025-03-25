import { CommonModule } from '@angular/common';
import {
	Component,
	ElementRef,
	Inject,
	OnDestroy,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GlobalTooltipOption, Options, Tabulator } from 'tabulator-tables';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { getTabulatorCols, IGridColumn } from '@sneat/grid';
import { routingParamEnvironmentId } from '@sneat/ext-datatug-core';
import {
	IDatabaseFull,
	IEnvironmentFull,
	IProjectFull,
	ITableFull,
} from '@sneat/ext-datatug-models';
import { ProjectService } from '@sneat/ext-datatug-services-project';
import {
	DatatugNavService,
	ProjectTracker,
} from '@sneat/ext-datatug-services-nav';
import { IProjectContext } from '@sneat/ext-datatug-nav';
import { Subject } from 'rxjs';

interface IRecordsetInfo {
	schema: string;
	name: string;
	cols?: number;
	rows?: number;
	fks?: number;
	refsBy?: number;
	t: ITableFull;
}

@Component({
	selector: 'sneat-datatug-env-db',
	templateUrl: './env-db-page.component.html',
	imports: [CommonModule, FormsModule, IonicModule],
})
export class EnvDbPageComponent implements OnDestroy, OnInit {
	@ViewChild('grid', { static: false }) gridElRef?: ElementRef;

	filter = '';
	tab: 'tables' | 'views' = 'tables';

	project?: IProjectContext;
	projectFull?: IProjectFull;
	env?: IEnvironmentFull;
	envDb?: IDatabaseFull;

	defaultColDef = {
		resizable: true,
	};

	allRows: Record<string, IRecordsetInfo[]> = {};
	filteredRows: Record<string, IRecordsetInfo[]> = {};

	private tabulator?: Tabulator;

	private readonly destroyed = new Subject<void>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly projService: ProjectService,
		private datatugNavService: DatatugNavService,
		private readonly route: ActivatedRoute,
	) {
		// this.tabulator = new Tabulator({
		// 	// columns: this.tablesCols,
		// });
		this.envDb = history.state.db as IDatabaseFull;
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnInit(): void {
		const projectTracker = new ProjectTracker(this.destroyed, this.route);
		projectTracker.projectRef.subscribe({
			next: (projectRef) => {
				this.projService.getFull(projectRef).subscribe((p) => {
					this.projectFull = p;
					const envId = this.route.snapshot.params[routingParamEnvironmentId];
					this.env = p.environments?.find((e) => e.id === envId);
					// const dbId = params.get('routingParamDbId');
					// this.envDb = this.env.dbServer.find(db => db.id === dbId);
					this.onDataChanged();
				});
			},
		});
	}

	public tabChanged(): void {
		const map2row = (t: ITableFull) => {
			const row: IRecordsetInfo = {
				schema: t.schema,
				name: t.name,
				cols: t.columns?.length,
				fks: t.foreignKeys?.length,
				refsBy: t.referencedBy?.length,
				t,
			};
			return row;
		};
		if (this.filteredRows[this.tab]) {
			this.tabulator?.setData(this.filteredRows[this.tab]).catch(console.error);
		} else if (!this.allRows[this.tab]) {
			switch (this.tab) {
				case 'tables':
					this.allRows[this.tab] = this.envDb?.tables?.map(map2row) || [];
					break;
				case 'views':
					this.allRows[this.tab] = this.envDb?.views?.map(map2row) || [];
					break;
			}
			this.filterRows();
		}
	}

	public filterRows(): void {
		let rows = this.allRows[this.tab];
		if (this.filter) {
			const v = this.filter.toLowerCase();
			rows = rows.filter((r) => r.name.toLowerCase().includes(v));
		}
		this.filteredRows[this.tab] = rows;
		if (this.tabulator) {
			this.tabulator.setData(rows).catch(console.error);
		} else {
			this.createTabulator();
		}
	}

	private createTabulator(): void {
		const columns: IGridColumn[] = [
			// {field: 'schema', dbType: 'str', title: 'Schema', widthGrow: 2},
			{
				field: 'name',
				dbType: 'str',
				title: 'Name',
				widthGrow: 4, // resizable: true,
				// cellRendererFramework: RouterLinkRendererComponent,
				// cellRendererParams: {
				// 	routerLinkRendererComponentOptions: (param): IRouterLinkRendererComponentOptions => {
				// 		if (param.data.name) {
				// 			const linkParams = ['./' + this.tab, `${param.data.schema}.${param.data.name}`];
				// 			return {
				// 				routerLinkParams: linkParams,
				// 				linkDescription: param.data.name,
				// 			};
				// 		} else {
				// 			return {
				// 				textOnly: JSON.stringify(param.data),
				// 			};
				// 		}
				// 	}
				// },
			},
			{
				title: 'Cols',
				dbType: 'integer',
				field: 'cols',
				widthGrow: 1,
				hozAlign: 'right',
				tooltip: this.colsTooltip as unknown as GlobalTooltipOption, // TODO: fix
			},
			{
				title: 'FKs',
				dbType: 'integer',
				field: 'fks',
				widthGrow: 1,
				hozAlign: 'right',
				tooltip: this.fksTooltip as unknown as GlobalTooltipOption,
			},
			{
				title: 'Refs By',
				dbType: 'integer',
				field: 'refsBy',
				widthGrow: 1,
				hozAlign: 'right',
				tooltip: this.refsByTooltip as unknown as GlobalTooltipOption,
			},
			{
				title: 'Rows',
				dbType: 'integer',
				field: 'rows',
				widthGrow: 1,
				hozAlign: 'right',
			},
		];

		const options = {
			data: this.filteredRows[this.tab],
			layout: 'fitColumns',
			groupBy: 'schema',
			columns: getTabulatorCols(columns),
			rowClick: (e: unknown, row: { getData: () => IRecordsetInfo }) => {
				const data: IRecordsetInfo = row.getData();
				const project = this.project;
				const env = this.env;
				const envDb = this.envDb;
				if (!project || !env || !envDb) {
					return;
				}
				this.datatugNavService.goTable({
					project,
					env: env.id,
					// store: this.a
					db: envDb.id,
					schema: data.t.schema,
					name: data.t.name,
				});
			},
		};
		console.log('createTabulator()', this.gridElRef?.nativeElement, options);
		if (this.gridElRef) {
			this.tabulator = new Tabulator(
				this.gridElRef?.nativeElement,
				options as unknown as Options,
			);
		}
	}

	private onDataChanged(): void {
		this.allRows = {};
		this.tabChanged();
	}

	private colsTooltip = (cell: { getData: () => IRecordsetInfo }) => {
		const data: IRecordsetInfo = cell.getData();
		return (
			'COLUMNS:\n' +
			data.t.columns?.map((c) => `${c.name}: ${c.dbType}`).join('\n')
		);
	};

	private fksTooltip = (cell: { getData: () => IRecordsetInfo }) => {
		const data: IRecordsetInfo = cell.getData();
		return (
			'FOREIGN KEYS:\n' +
			data.t.foreignKeys
				?.map((fk) => `${fk.name} (${fk.columns.join(', ')})`)
				.join('\n')
		);
	};

	private refsByTooltip = (cell: { getData: () => IRecordsetInfo }) => {
		const data: IRecordsetInfo = cell.getData();
		return (
			'REFERENCED BY:\n' +
			data.t.referencedBy
				?.map(
					(ref) =>
						`${ref.schema}.${ref.name} (${ref.foreignKeys
							.map((fk) => fk.name)
							.join(', ')})`,
				)
				.join('\n')
		);
	};
}
