import { Inject, Injectable } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import posthog from 'posthog-js';
import { IAnalyticsService } from './analytics.interface';

@Injectable()
export class PosthogAnalyticsService implements IAnalyticsService {
	constructor(@Inject(ErrorLogger) private errorLogger: IErrorLogger) {}

	public identify(userID: string): void {
		posthog.identify(userID);
	}

	public logEvent(
		eventName: string,
		eventParams?: Readonly<Record<string, unknown>>,
	): void {
		try {
			posthog.capture(eventName, eventParams);
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to log event to Posthog', {
				show: false,
			});
		}
	}

	public setCurrentScreen(screenName: string): void {
		try {
			posthog.capture('$screen_view', { screen_name: screenName });
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to log screen view to Posthog', {
				show: false,
			});
		}
	}

	public loggedOut() {
		try {
			posthog.reset();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to reset Posthog', { show: false });
		}
	}
}
