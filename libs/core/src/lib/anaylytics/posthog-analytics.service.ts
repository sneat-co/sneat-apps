import { inject, Injectable } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import posthog, { PostHog } from 'posthog-js';
import { IAnalyticsService } from './analytics.interface';

const ph = posthog as unknown as PostHog;

@Injectable()
export class PosthogAnalyticsService implements IAnalyticsService {
	private errorLogger = inject<IErrorLogger>(ErrorLogger);

	public identify(userID: string): void {
		ph.identify(userID);
	}

	public logEvent(
		eventName: string,
		eventParams?: Readonly<Record<string, unknown>>,
	): void {
		try {
			ph.capture(eventName, eventParams);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to log event to Posthog', {
				show: false,
			});
		}
	}

	public setCurrentScreen(screenName: string): void {
		try {
			ph.capture('$screen_view', { screen_name: screenName });
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to log screen view to Posthog', {
				show: false,
			});
		}
	}

	public loggedOut() {
		try {
			ph.reset();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to reset Posthog', { show: false });
		}
	}
}
