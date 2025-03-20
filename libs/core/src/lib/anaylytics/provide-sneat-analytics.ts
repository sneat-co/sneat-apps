import { Analytics } from '@angular/fire/analytics';
import { FirebaseApp } from '@angular/fire/app';
import { IEnvironmentConfig } from '../environment-config';
import { AnalyticsService, IAnalyticsService } from './analytics.interface';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { FireAnalyticsService } from './fire-analytics.service';
import { MultiAnalyticsService } from './multi-analytics.service';
import { PosthogAnalyticsService } from './posthog-analytics.service';
import { Optional, Provider } from '@angular/core';

export interface IAnalyticsConfig {
	addPosthog?: boolean;
	addFirebaseAnalytics?: boolean;
}

function getAnalyticsConfig(
	environmentConfig: IEnvironmentConfig,
): IAnalyticsConfig {
	const useAnalytics =
		location.host === 'sneat.app' || location.protocol === 'https:';

	const firebaseMeasurementId = environmentConfig.firebaseConfig?.measurementId;

	return {
		addPosthog: useAnalytics && !!environmentConfig.posthog?.posthogKey,
		addFirebaseAnalytics:
			useAnalytics &&
			!!firebaseMeasurementId &&
			firebaseMeasurementId !== 'G-PROVIDE_IF_NEEDED',
	};
}

export function provideSneatAnalytics(
	environmentConfig: IEnvironmentConfig,
): Provider {
	return {
		provide: AnalyticsService,
		deps: [
			ErrorLogger,
			FirebaseApp,
			// Analytics,
			[new Optional(), Analytics],
		],
		useFactory: (errorLogger: IErrorLogger, analytics: Analytics) => {
			const config = getAnalyticsConfig(environmentConfig);
			console.log(`provideSneatAnalytics(), config: ${JSON.stringify(config)}`);
			const as: IAnalyticsService[] = [];
			if (config?.addPosthog) {
				as.push(new PosthogAnalyticsService(errorLogger));
			}
			if (config?.addFirebaseAnalytics) {
				if (analytics) {
					as.push(new FireAnalyticsService(errorLogger, analytics));
				} else {
					errorLogger.logError(
						'addFirebaseAnalytics==true, but Firebase Analytics is not provided',
						undefined,
						{ show: false, feedback: false },
					);
				}
			}
			return new MultiAnalyticsService(as);
		},
	};
}
