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
	tooltip?: (cell: any) => string;
	formatter?: any;
	hozAlign?: 'left' | 'right';
	widthShrink?: number;
	widthGrow?: number;
	width?: number | string;
}

export const getTabulatorCols = (cols: IGridColumn[]): any[] =>
	cols.map((c) => {
		const v = { ...c } as any;
		delete v.dbType;
		return v;
	});
