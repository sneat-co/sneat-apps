export interface IGridDef {
	columns: IGridColumn[];
	rows?: unknown[];
	groupBy?: string;
}

export interface IGridColumn {
	field: string;
	colName?: string;
	dbType: string;
	title: string;
	tooltip?: (cell: unknown) => string;
	formatter?: 'link' | 'progress' | 'html' | 'text' | 'number' | 'money' | 'image' | 'tickCross';
	hozAlign?: 'left' | 'right';
	headerHozAlign?: 'left' | 'right';
	widthShrink?: number;
	widthGrow?: number;
	width?: number | string;
}

export const getTabulatorCols = (cols: IGridColumn[]): unknown[] =>
	cols.map((c) => {
		const v = { ...c } as { dbType?: unknown };
		delete v.dbType;
		return v;
	});
