import posthog from 'posthog-js';
import { IAnalyticsService } from './analytics.interface';

export class PosthogAnalyticsService implements IAnalyticsService {
	public identify(userID: string): void {
		posthog.identify(userID);
	}

	public logEvent(
		eventName: string,
		eventParams?: Readonly<Record<string, unknown>>,
	): void {
		posthog.capture(eventName, eventParams);
	}

	public setCurrentScreen(screenName: string): void {
		posthog.capture('$screen_view', { screen_name: screenName });
	}

	public loggedOut() {
		posthog.reset();
	}
}
