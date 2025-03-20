import { Inject, Injectable, Optional } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import firebase from 'firebase/compat';
import {
	IAnalyticsCallOptions,
	IAnalyticsService,
	UserProperties,
} from './analytics.interface';
import CustomParams = firebase.analytics.CustomParams;

// const logErrOptions: ILogErrorOptions = { show: false, feedback: false };

@Injectable()
export class FireAnalyticsService implements IAnalyticsService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly angularFireAnalytics: AngularFireAnalytics,
	) {}

	public logEvent(
		eventName: string,
		eventParams?: Record<string, unknown>,
		options?: IAnalyticsCallOptions,
	): void {
		this.angularFireAnalytics.logEvent(eventName, eventParams, options);
	}

	public setCurrentScreen(
		screenName: string,
		options?: IAnalyticsCallOptions,
	): void {
		console.log(screenName, options);
		// setCurrentScreen
		// logEvent(this.angularFireAnalytics, 'screen_view', {'screenName': screenName}, options);
	}

	private readonly logError = this.errorLogger.logErrorHandler;

	public identify(
		userID: string,
		userPropertiesToSet?: UserProperties,
		userPropertiesToSetOnce?: UserProperties,
	): void {
		this.angularFireAnalytics
			?.setUserId(userID)
			.catch(this.logError('failed to set user id in Firebase analytics'));
		if (userPropertiesToSetOnce) {
			this.angularFireAnalytics
				?.setUserProperties(userPropertiesToSet as CustomParams)
				.catch(
					this.logError('failed to set user properties in Firebase analytics'),
				);
		}
	}

	public loggedOut() {
		this.angularFireAnalytics
			.setUserId(null as unknown as string)
			.catch(this.logError('failed to logout user in Firebase analytics'));
	}
}
