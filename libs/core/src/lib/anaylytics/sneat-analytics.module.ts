import { Analytics } from '@angular/fire/analytics';
import { FirebaseApp } from '@angular/fire/app';
import { AnalyticsService } from './analytics.interface';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { FireAnalyticsService } from './fire-analytics.service';
import { MultiAnalyticsService } from './multi-analytics.service';
import { PosthogAnalyticsService } from './posthog-analytics.service';
import { Provider } from '@angular/core';

export function provideSneatAnalytics(): Provider {
	return {
		provide: AnalyticsService,
		deps: [ErrorLogger, FirebaseApp, Analytics],
		useFactory: (errorLogger: IErrorLogger, angularFireAnalytics: Analytics) =>
			new MultiAnalyticsService([
				new FireAnalyticsService(errorLogger, angularFireAnalytics),
				new PosthogAnalyticsService(errorLogger),
			]),
	};
}
