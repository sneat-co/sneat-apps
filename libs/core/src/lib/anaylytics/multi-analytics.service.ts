import {
	IAnalyticsCallOptions,
	IAnalyticsService,
	UserProperties,
} from './analytics.interface';

export class MultiAnalyticsService implements IAnalyticsService {
	constructor(
		private readonly analyticsServices: readonly IAnalyticsService[],
	) {}

	public identify(
		userID: string,
		userPropertiesToSet?: UserProperties,
		userPropertiesToSetOnce?: UserProperties,
	): void {
		console.log(`MultiAnalyticsService.identify(userID=${userID})`);
		this.analyticsServices.forEach((as) =>
			as.identify(userID, userPropertiesToSet, userPropertiesToSetOnce),
		);
	}

	public logEvent(
		eventName: string,
		eventParams?: Readonly<Record<string, unknown>>,
		options?: IAnalyticsCallOptions,
	): void {
		console.log(`MultiAnalyticsService.logEvent(eventName=${eventName})`);
		this.analyticsServices.forEach((as) =>
			as.logEvent(eventName, eventParams, options),
		);
	}

	public setCurrentScreen(
		screenName: string,
		options?: IAnalyticsCallOptions,
	): void {
		console.log(
			`MultiAnalyticsService.setCurrentScreen(screenName=${screenName})`,
		);
		this.analyticsServices.forEach((as) =>
			as.setCurrentScreen(screenName, options),
		);
	}

	public loggedOut(): void {
		console.log('MultiAnalyticsService.loggedOut()');
		this.analyticsServices.forEach((as) => as.loggedOut());
	}
}
