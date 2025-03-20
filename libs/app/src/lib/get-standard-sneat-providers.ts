import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import {
	LOGGER_FACTORY,
	loggerFactory,
	provideSneatAnalytics,
} from '@sneat/core';
import { sentryAppInitializerProviders } from '@sneat/logging';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { AppComponentService } from './app-component.service';
import { IEnvironmentConfig } from './environment-config';
import { getAngularFireProviders } from './init-firebase';

export function getStandardSneatProviders(
	environmentConfig: IEnvironmentConfig,
): readonly (Provider | EnvironmentProviders)[] {
	console.log(
		'getStandardSneatProviders(), environmentConfig:' +
			JSON.stringify(environmentConfig, undefined, '\t'),
	);

	const useAnalytics =
		location.host === 'sneat.app' || location.protocol === 'https:';

	const firebaseMeasurementId = environmentConfig.firebaseConfig?.measurementId;

	return [
		provideHttpClient(),
		{ provide: LOGGER_FACTORY, useValue: loggerFactory },
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		...sentryAppInitializerProviders,
		...getAngularFireProviders(environmentConfig.firebaseConfig),
		{
			provide: SneatApiBaseUrl,
			useValue: environmentConfig.useNgrok
				? `//${location.host}/v0/`
				: environmentConfig.firebaseConfig.emulator
					? 'https://local-api.sneat.ws/v0/' // 'http://localhost:4300/v0/'
					: DefaultSneatAppApiBaseUrl,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
		provideSneatAnalytics({
			addPosthog: useAnalytics && !!environmentConfig.posthog?.posthogKey,
			addFirebaseAnalytics:
				useAnalytics &&
				!!firebaseMeasurementId &&
				firebaseMeasurementId !== 'G-PROVIDE_IF_NEEDED',
		}),
		AppComponentService, // TODO: check if it's used and probably remove
	];
}
