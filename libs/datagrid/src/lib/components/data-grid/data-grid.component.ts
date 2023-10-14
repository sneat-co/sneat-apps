import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
	Tabulator,
	SelectRowModule,
	MenuModule,
	InteractionModule,
	Module,
	RowContextMenuSignature,
} from 'tabulator-tables';
import { IGridColumn } from '@sneat/grid';
import {
	TabulatorColumn,
	TabulatorOptions,
} from '../../tabulator/tabulator-options';

class AdvertModule extends Module {
	public static override moduleName = 'advert';

	constructor(table: Tabulator) {
		super(table);
		console.log('AdvertModule.constructor()');
	}

	initialize() {
		console.log('AdvertModule.initialize()');
	}
}

Tabulator.registerModule([
	InteractionModule,
	SelectRowModule,
	AdvertModule,
	MenuModule,
]);

// console.log('SelectRowModule', );

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
	selector: 'sneat-datagrid',
	template: `
		<div id="tabulator" #tabulatorDiv></div>
		<p class="ion-margin-start">Rows: {{ data?.length }}</p>
	`,
})
export class DataGridComponent implements AfterViewInit, OnChanges {
	@Input() layout?: 'fitData' | 'fitColumns' = 'fitColumns';
	@Input() data?: unknown[] = [];
	@Input() columns?: IGridColumn[] = [];
	@Input() groupBy?: string;
	@Input() height?: string;
	@Input() maxHeight?: string | number;
	@Input() rowContextMenu?: RowContextMenuSignature;
	@ViewChild('tabulatorDiv', { static: true }) tabulatorDiv?: ElementRef;

	@Input() rowClick?: (event: Event, row: unknown) => void;

	@Output() readonly rowSelected = new EventEmitter<{
		row: unknown;
		event?: Event;
	}>();

	// private tab = document.createElement('div');
	private tabulator?: Tabulator;

	@Input() public selectable?: boolean | number | 'highlight';

	private tabulatorOptions?: TabulatorOptions;
	private clickEvent?: Event;

	constructor(@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger) {
		console.log('DataGridComponent.constructor()');
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('DataGridComponent.ngOnChanges():', changes);
		try {
			if (
				(changes['data'] && this.data && this.columns) ||
				(changes['columns'] && this.columns) ||
				(changes['rowClick'] && this.rowClick)
			) {
				this.drawTable();
			}
		} catch (ex) {
			this.errorLogger.logError(
				ex,
				'Failed to process ngOnChanges in DataGridComponent',
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
			try {
				this.tabulator.redraw();
			} catch (e) {
				this.errorLogger.logError(e, 'Failed to redraw tabulator', {
					show: false,
					report: false,
				});
			}
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
			this.data,
		);
		try {
			if (!this.tabulatorDiv) {
				this.errorLogger.logError(new Error('!this.tabulatorDiv'));
				return;
			}
			if (this.tabulatorOptions) {
				this.tabulatorOptions = { ...this.tabulatorOptions, data: this.data };
				this.tabulator?.setData(this.data);
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
		this.setTabulatorOptions();
		if (!this.tabulator) {
			this.tabulatorOptions = {
				...this.tabulatorOptions,
				// rowClick: function (e, row) {
				// 	console.log('rowClick1', row);
				// },
				// rowSelect: function (row) {
				// 	console.log('rowSelect', row);
				// },
				// rowDeselect: function (row) {
				// 	console.log('rowDeselect', row);
				// }
			};
			console.log(
				'createTabulatorGrid(): tabulatorOptions:',
				this.tabulatorOptions,
			);
			this.tabulator = new Tabulator(
				this.tabulatorDiv?.nativeElement,
				this.tabulatorOptions,
			);
			this.tabulator.on('rowClick', (event: Event, row: unknown) => {
				console.log('rowClick event', event, row);
				this.clickEvent = event;
				if (this.rowClick) {
					this.rowClick(event, row);
				}
			});
			this.tabulator.on('rowSelected', (row: unknown) =>
				this.rowSelected.emit({ row, event: this.clickEvent }),
			);
			this.tabulator.on('rowDeselected', (row: unknown) =>
				console.log('rowDeselected event', row),
			);
		}
	}

	private setTabulatorOptions(): void {
		this.tabulatorOptions = {
			// tooltipsHeader: true, // enable header tooltips
			// tooltipGenerationMode: 'hover',
			rowContextMenu: this.rowContextMenu,
			selectable: this.selectable,
			data: this.data,
			// reactiveData: true, // enable data reactivity
			columns: this.columns?.map((c) => {
				const col: TabulatorColumn = {
					// TODO(help-wanted): Use strongly typed Tabulator col def
					field: c.field,
					title: c.title || c.field || c.title,
					// headerTooltip: () =>
					// 	`${c.colName || c.title || c.field}: ${c.dbType}`,
				};
				if (c.colName !== 'Id' && c.colName?.endsWith('Id')) {
					col.formatter = 'link';
					col.formatterParams = {
						url: 'test-url',
					};
					col.cellClick = (e: Event, cell: unknown) => {
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
				if (c.headerHozAlign) {
					col.headerHozAlign = c.headerHozAlign;
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
			layout: this.layout || 'fitColumns',
		};
		if (this.height) {
			this.tabulatorOptions = {
				...this.tabulatorOptions,
				height: this.height,
			};
		}
		if (this.maxHeight) {
			this.tabulatorOptions = {
				...this.tabulatorOptions,
				maxHeight: this.maxHeight,
			};
		}
		if (this.groupBy) {
			this.tabulatorOptions = {
				...this.tabulatorOptions,
				groupBy: this.groupBy,
				groupHeader: (value: unknown, count: number) => {
					// value - the value all members of this group share
					// count - the number of rows in this group
					// data - an array of all the row data objects in this group
					// group - the group component for the group
					// console.log('groupHeader', value);
					return `${
						this.groupBy
					}: ${value} <span class="ion-margin-start">(${count} ${
						count === 1 ? 'record' : 'records'
					})</span>`;
				},
			};
		}
	}
}
