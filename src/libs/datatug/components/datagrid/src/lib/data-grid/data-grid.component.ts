import {
	AfterViewInit,
	Component,
	ElementRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {Tabulator} from 'tabulator-tables';
import { IGridColumn } from '@sneat/grid';

// export interface IGridDef {
// 	columns: IGridColumn[],
// 	rows?: unknown[],
// 	groupBy?: string;
// }
//
// export const getTabulatorCols = (cols: IGridColumn[]): any[] => cols.map(c => {
// 	const v = {...c};
// 	delete v.dbType;
// 	return v;
// });
//
// export interface IGridColumn {
// 	field: string;
// 	colName?: string;
// 	dbType: string;
// 	title: string;
// 	tooltip?: (cell: any) => string;
// 	formatter?: any;
// 	hozAlign?: 'left' | 'right';
// 	widthShrink?: number;
// 	widthGrow?: number;
// 	width?: number | string;
// }

/**
 * This is a wrapper class for the tabulator JS library.
 * For more info see http://tabulator.info
 */
@Component({
	selector: 'datatug-grid',
	styleUrls: ['./data-grid.component.scss'],
	template: ` <div id="tabulator" #container></div>
		<p class="ion-margin-start">Rows: {{ data?.length }}</p>`,
})
export class DataGridComponent implements AfterViewInit, OnChanges {
	@Input() layout?: 'fitData' | 'fitColumns';
	@Input() data?: any[] = [];
	@Input() columns?: IGridColumn[] = [];
	@Input() groupBy?: string;
	@Input() height?: string | number = '700px';
	@Input() maxHeight?: string | number;
	@ViewChild('container', { static: true }) tabulatorDiv?: ElementRef;

	@Input() rowClick?: (event: Event, row: any) => void;

	// private tab = document.createElement('div');
	private tabulator: Tabulator;

	private tabulatorOptions: any;

	constructor(@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger) {
		console.log('DataGridComponent.constructor()');
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('DataGridComponent.ngOnChanges():', changes);
		try {
			if (
				(changes["data"] && this.data && this.columns) ||
				(changes["columns"] && this.columns)
			) {
				this.drawTable();
			}
		} catch (ex) {
			this.errorLogger.logError(
				ex,
				'Failed to process ngOnChanges in DataGridComponent'
			);
		}
	}

	// ngOnDestroy(): void {
		// console.log('DataGridComponent.ngOnDestroy()', this.tabulator);
		// try { // TODO: destroy Tabulator
		// 	if (this.tabulator?.element) {
		// 		// noinspection TypeScriptValidateJSTypes
		// 		this.tabulator.element.tabulator('destroy');
		// 	}
		// } catch (ex) {
		// 	this.errorLogger.logError(ex, 'Failed to destroy tabulator');
		// }
	// }

	ngAfterViewInit(): void {
		if (this.tabulator) {
			this.tabulator.redraw();
		}
	}

	private drawTable(): void {
		if (!this.data || !this.columns) {
			console.warn('drawTable()', 'columns:', this.columns, 'data:', this.data);
			return;
		}
		console.log(
			'drawTable()',
			'columns:',
			this.columns,
			'groupBy:',
			this.groupBy,
			'data:',
			this.data
		);
		try {
			if (!this.tabulatorDiv) {
				this.errorLogger.logError(new Error('!this.tabulatorDiv'));
				return;
			}
			if (this.tabulatorOptions) {
				this.tabulatorOptions.data = this.data;
				this.tabulator.setData(this.data);
			} else {
				this.createTabulatorGrid();
			}
			// this.tabulatorDiv.nativeElement.appendChild(this.tab);
			// tabulator.redraw();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to drawTable');
		}
	}

	private createTabulatorGrid(): void {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		this.tabulatorOptions = {
			tooltipsHeader: true, // enable header tooltips
			tooltipGenerationMode: 'hover',
			data: this.data,
			reactiveData: true, // enable data reactivity
			columns: this.columns?.map((c) => {
				const col: any = {
					// TODO(help-wanted): Use strongly typed Tabulator col def
					field: c.field,
					title: c.title || c.field,
					headerTooltip: () =>
						`${c.colName || c.title || c.field}: ${c.dbType}`,
				};
				if (c.colName !== 'Id' && c.colName?.endsWith('Id')) {
					col.formatter = 'link';
					col.formatterParams = {
						url: 'test-url',
					};
					col.cellClick = (e: Event, cell: any) => {
						e.preventDefault();
						e.stopPropagation();
						console.log('cellClick', cell);
					};
				}
				if (c.tooltip) {
					col.tooltip = c.tooltip;
				}
				if (c.formatter) {
					col.formatter = c.formatter;
				}
				if (c.hozAlign) {
					col.hozAlign = c.hozAlign;
				}
				if (c.widthGrow) {
					col.widthGrow = c.widthGrow;
				}
				if (c.widthShrink) {
					col.widthShrink = c.widthShrink;
				}
				if (c.width !== undefined) {
					col.width = c.width;
				}
				// console.log('col:', col);
				return col;
			}),
			layout: this.layout || 'fitData',
			height: this.height,
			maxHeight: this.maxHeight,
		};
		if (this.groupBy) {
			this.tabulatorOptions.groupBy = this.groupBy;
			this.tabulatorOptions.groupHeader = (value: any, count: number) => {
				// value - the value all members of this group share
				// count - the number of rows in this group
				// data - an array of all the row data objects in this group
				// group - the group component for the group
				console.log('groupHeader', value);
				return `${
					this.groupBy
				}: ${value} <span class="ion-margin-start">(${count} ${
					count === 1 ? 'record' : 'records'
				})</span>`;
			};
		}
		if (this.rowClick) {
			this.tabulatorOptions.rowClick = this.rowClick;
		}
		if (!this.tabulator) {
			this.tabulator = new Tabulator(
				this.tabulatorDiv?.nativeElement,
				this.tabulatorOptions
			);
		}
	}
}
