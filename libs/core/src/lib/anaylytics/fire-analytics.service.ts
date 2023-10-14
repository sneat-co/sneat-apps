import { Inject, Injectable, Optional } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAnalyticsCallOptions, IAnalyticsService } from './analytics.interface';
import { Analytics as AngularFireAnalytics, logEvent } from '@angular/fire/analytics';

// const logErrOptions: ILogErrorOptions = { show: false, feedback: false };

@Injectable()
export class FireAnalyticsService implements IAnalyticsService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Optional() private readonly angularFireAnalytics?: AngularFireAnalytics,
	) {
	}

	public logEvent(
		eventName: string,
		eventParams?: { [key: string]: unknown },
		options?: IAnalyticsCallOptions,
	): void {
		if (this.angularFireAnalytics) {
			logEvent(this.angularFireAnalytics, eventName, eventParams, options);
		}
	}

	public setCurrentScreen(
		screenName: string,
		options?: IAnalyticsCallOptions,
	): void {
		console.log(screenName, options);
		// setCurrentScreen
		// logEvent(this.angularFireAnalytics, 'screen_view', {'screenName': screenName}, options);
	}
}
