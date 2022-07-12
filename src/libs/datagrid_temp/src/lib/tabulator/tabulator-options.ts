export interface TabulatorColumn {
	field: string;
	title?: string;
	formatter?: 'link' | 'progress' | 'html' | 'text' | 'number' | 'money' | 'image' | 'tickCross';
	formatterParams?: unknown;
	cellClick?: (e: Event, cell: unknown) => void;
	headerTooltip?: () => string;
	tooltip?: (cell: any) => string;
	hozAlign?: 'left' | 'right';
	widthShrink?: number;
	widthGrow?: number;
	width?: number | string;
}

export interface TabulatorOptions {
	readonly tooltipsHeader?: boolean;
	readonly tooltipGenerationMode?: 'hover' | 'mouseover';
	readonly reactiveData?: boolean;
	readonly data?: unknown[];
	readonly layout?: 'fitData' | 'fitColumns';
	readonly columns?: TabulatorColumn[];
	readonly height?: string | number;
	readonly maxHeight?: string | number;
	readonly groupBy?: string;
	readonly groupHeader?: (value: any, count: number) => string;
	rowClick?: (event: Event, row: unknown) => void;
}
