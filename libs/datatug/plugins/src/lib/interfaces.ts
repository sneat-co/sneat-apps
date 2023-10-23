export interface IJsonGridData {
	cols: string[];
	rows: unknown[][];
}

export interface IPipe {
	tunnel: (o: unknown) => unknown;
}
