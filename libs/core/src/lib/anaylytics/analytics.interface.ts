import { InjectionToken } from '@angular/core';

export interface IAnalyticsCallOptions {
	// If true, this config or event call applies globally to all analytics properties on the page.
	global: boolean;
}

/*
 * An interface for analytics service
 */
export interface IAnalyticsService {
	logEvent(
		eventName: string,
		eventParams?: { [key: string]: unknown },
		options?: IAnalyticsCallOptions,
	): void;

	setCurrentScreen(screenName: string, options?: IAnalyticsCallOptions): void;
}

export const AnalyticsService = new InjectionToken<IAnalyticsService>(
	'IAnalyticsService',
);
