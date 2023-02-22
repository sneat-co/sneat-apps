export interface IObjectPropertyMatcher {
	matches(path: string, o: unknown): boolean;
}

export interface IWidgetRef {
	widgetId: string;
	matcher: IObjectPropertyMatcher;
	settings?: unknown;
}
