export interface IJsonGridData {
	cols: string[];
	rows: unknown[][];
}

export interface IObjectPropertyMatcher {
	matches(path: string, o: any): boolean
}

export interface IPipe {
	tunnel: (o: unknown) => any;
}

export interface IWidgetRef {
	widgetId: string;
	matcher: IObjectPropertyMatcher;
	settings?: unknown;
}
