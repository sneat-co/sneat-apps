import { ColumnDefinition, Options } from 'tabulator-tables';

export type TabulatorColumn = ColumnDefinition;

// export interface TabulatorColumn {
// 	field: string;
// 	title?: string;
// 	formatter?: 'link' | 'progress' | 'html' | 'text' | 'number' | 'money' | 'image' | 'tickCross';
// 	formatterParams?: unknown;
// 	cellClick?: (e: Event, cell: unknown) => void;
// 	headerTooltip?: () => string;
// 	tooltip?: (cell: unknown) => string;
// 	hozAlign?: 'left' | 'right';
// 	headerHozAlign?: 'left' | 'right';
// 	widthShrink?: number;
// 	widthGrow?: number;
// 	width?: number | string;
// }

export type TabulatorOptions = Options;
// export interface TabulatorOptions {
// 	readonly tooltipsHeader?: boolean;
// 	readonly tooltipGenerationMode?: 'hover' | 'mouseover';
// 	readonly reactiveData?: boolean;
// 	readonly selectable?: boolean | number | 'highlight';
// 	readonly data?: unknown[];
// 	readonly layout?: 'fitData' | 'fitColumns';
// 	readonly columns?: TabulatorColumn[];
// 	readonly height?: string | number;
// 	readonly maxHeight?: string | number;
// 	readonly groupBy?: string;
// 	readonly groupHeader?: (value: unknown, count: number) => string;
// 	readonly rowClick?: (event: Event, row: unknown) => void;
// 	readonly rowSelect?: (row: unknown) => void;
// 	readonly rowDeselect?: (row: unknown) => void;
// 	readonly rowContextMenu?: IRowMenu[];
// }
