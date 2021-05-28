import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import Tabulator from 'tabulator-tables';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {getTabulatorCols, IGridColumn} from '@sneat/grid';
import {routingParamEnvironmentId, routingParamProjectId} from '@sneat/datatug/routes';
import {IDatabaseFull, IEnvironmentFull, IDatatugProjectFull, ITableFull} from '@sneat/datatug/models';
import {ProjectService} from '@sneat/datatug/services/project';
import {DatatugNavService} from '@sneat/datatug/services/nav';

interface IRecordsetInfo {
	schema: string;
	name: string;
	cols?: number;
	rows?: number;
	fks?: number;
	refsBy?: number;
	t: ITableFull,
}

@Component({
	selector: 'datatug-env-db',
	templateUrl: './env-db.page.html',
	styleUrls: ['./env-db.page.scss'],
})
export class EnvDbPage implements AfterViewInit {

	@ViewChild('grid', {static: false}) gridElRef: ElementRef;

	filter = '';
	tab: 'tables' | 'views' = 'tables';

	projectId: string;
	project: IDatatugProjectFull;
	env: IEnvironmentFull;
	envDb: IDatabaseFull;

	defaultColDef = {
		resizable: true
	};

	allRows: { [tab: string]: IRecordsetInfo[] } = {};
	filteredRows: { [tab: string]: IRecordsetInfo[] } = {};

	private tabulator: Tabulator;

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

	ngAfterViewInit(): void {
		this.route.paramMap.subscribe({
			next: params => {
				const envId = params.get(routingParamEnvironmentId);
				this.projectId = params.get(routingParamProjectId);
				const [projectId, repoId] = this.projectId.split('@');

				this.projService.getFull({repoId, projectId}).subscribe(p => {
					this.project = p;
					this.env = p.environments.find(e => e.id === envId);
					// const dbId = params.get('routingParamDbId');
					// this.envDb = this.env.dbServer.find(db => db.id === dbId);
					this.onDataChanged();
				});
			},
			error: err => this.errorLogger.logError(err, 'Failed to get router params'),
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
			this.tabulator.setData(this.filteredRows[this.tab]);
		} else if (!this.allRows[this.tab]) {
			switch (this.tab) {
				case 'tables':
					this.allRows[this.tab] = this.envDb.tables?.map(map2row) || [];
					break;
				case 'views':
					this.allRows[this.tab] = this.envDb.views?.map(map2row) || [];
					break;
			}
			this.filterRows();
		}
	}

	public filterRows(): void {
		let rows = this.allRows[this.tab];
		if (this.filter) {
			const v = this.filter.toLowerCase();
			rows = rows.filter(r => r.name.toLowerCase().indexOf(v) >= 0);
		}
		this.filteredRows[this.tab] = rows;
		if (this.tabulator) {
			this.tabulator.setData(rows)
		} else {
			this.createTabulator();
		}
	}

	private createTabulator(): void {
		const columns: IGridColumn[] = [
			// {field: 'schema', dbType: 'str', title: 'Schema', widthGrow: 2},
			{
				field: 'name', dbType: 'str', title: 'Name', widthGrow: 4, // resizable: true,
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
			{title: 'Cols', dbType: 'integer', field: 'cols', widthGrow: 1, hozAlign: 'right', tooltip: this.colsTooltip},
			{title: 'FKs', dbType: 'integer', field: 'fks', widthGrow: 1, hozAlign: 'right', tooltip: this.fksTooltip},
			{
				title: 'Refs By',
				dbType: 'integer',
				field: 'refsBy',
				widthGrow: 1,
				hozAlign: 'right',
				tooltip: this.refsByTooltip
			},
			{title: 'Rows', dbType: 'integer', field: 'rows', widthGrow: 1, hozAlign: 'right'},
		];

		const options = {
			data: this.filteredRows[this.tab],
			layout: 'fitColumns',
			groupBy: 'schema',
			columns: getTabulatorCols(columns),
			rowClick: (e, row) => {
				const data: IRecordsetInfo = row.getData();
				this.datatugNavService.goTable({
					target: {projectId: this.projectId, repoId: 'localhost:8989'},
					env: this.env.id,
					// store: this.a
					db: this.envDb.id,
					schema: data.t.schema,
					name: data.t.name,
				});
			},
		};
		console.log('createTabulator()', this.gridElRef.nativeElement, options);
		this.tabulator = new Tabulator(this.gridElRef.nativeElement, options);
	}

	private onDataChanged(): void {
		this.allRows = {};
		this.tabChanged();
	}

	private colsTooltip = cell => {
		const data: IRecordsetInfo = cell.getData();
		return 'COLUMNS:\n' + data.t.columns.map(c => `${c.name}: ${c.dbType}`).join('\n');
	}

	private fksTooltip = cell => {
		const data: IRecordsetInfo = cell.getData();
		return 'FOREIGN KEYS:\n' + data.t.foreignKeys?.map(fk => `${fk.name} (${fk.columns.join(', ')})`).join('\n');
	}

	private refsByTooltip = cell => {
		const data: IRecordsetInfo = cell.getData();
		return 'REFERENCED BY:\n'
			+ data.t.referencedBy
				?.map(ref => `${ref.schema}.${ref.name} (${ref.foreignKeys.map(fk => fk.name).join(', ')})`)
				.join('\n');
	}
}
