import { InjectionToken } from '@angular/core';

export interface IAnalyticsCallOptions {
	// If true, this config or event call applies globally to all analytics properties on the page.
	// This is from Firebase Analytics https://firebase.google.com/docs/reference/js/analytics.md#logevent_d5f1743
	global: boolean;
}

export type UserProperties = Record<string, unknown>;

/*
 * An interface for analytics service
 */
export interface IAnalyticsService {
	logEvent(
		eventName: string,
		eventParams?: Readonly<Record<string, unknown>>,
		options?: IAnalyticsCallOptions,
	): void;

	identify(
		userID: string,
		userPropertiesToSet?: UserProperties,
		userPropertiesToSetOnce?: UserProperties,
	): void;

	loggedOut(): void;

	setCurrentScreen(screenName: string, options?: IAnalyticsCallOptions): void;
}

export const AnalyticsService = new InjectionToken<IAnalyticsService>(
	'IAnalyticsService',
);
