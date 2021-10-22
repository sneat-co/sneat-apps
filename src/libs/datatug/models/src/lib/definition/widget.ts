export interface IObjectPropertyMatcher {
	matches(path: string, o: any): boolean;
}

export interface IWidgetRef {
	widgetId: string;
	matcher: IObjectPropertyMatcher;
	settings?: unknown;
}
