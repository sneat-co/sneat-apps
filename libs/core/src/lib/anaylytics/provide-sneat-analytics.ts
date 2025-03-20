import { Analytics, getAnalytics } from '@angular/fire/analytics';
import { FirebaseApp } from '@angular/fire/app';
import { IEnvironmentConfig } from '../environment-config';
import { AnalyticsService, IAnalyticsService } from './analytics.interface';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { FireAnalyticsService } from './fire-analytics.service';
import { MultiAnalyticsService } from './multi-analytics.service';
import { PosthogAnalyticsService } from './posthog-analytics.service';
import { Provider } from '@angular/core';

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
			// [new Optional(), Analytics], // TODO: The received Analytics instance does not have app property :(
		],
		useFactory: (errorLogger: IErrorLogger, fbApp: FirebaseApp) => {
			const config = getAnalyticsConfig(environmentConfig);
			console.log(`provideSneatAnalytics(), config: ${JSON.stringify(config)}`);
			const as: IAnalyticsService[] = [];
			if (config?.addPosthog) {
				as.push(new PosthogAnalyticsService(errorLogger));
			}
			if (config?.addFirebaseAnalytics) {
				const analytics: Analytics = fbApp && getAnalytics(fbApp); // Ideally we would want to get it from the DI
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
