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
import {
	provideErrorLogger,
	sentryAppInitializerProviders,
} from '@sneat/logging';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { AppComponentService } from './app-component.service';
import { IEnvironmentConfig } from '@sneat/core';
import { getAngularFireProviders } from './init-firebase';

// import { getAngularFireImports } from './init-firebase';

export function getStandardSneatProviders(
	environmentConfig: IEnvironmentConfig,
): readonly (Provider | EnvironmentProviders)[] {
	console.log(
		'getStandardSneatProviders(), environmentConfig:' +
			JSON.stringify(environmentConfig, undefined, '\t'),
	);

	return [
		provideHttpClient(),
		provideErrorLogger(),
		{ provide: LOGGER_FACTORY, useValue: loggerFactory },
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		...sentryAppInitializerProviders,
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
		getAngularFireProviders(environmentConfig.firebaseConfig),
		provideSneatAnalytics(environmentConfig),
		AppComponentService, // TODO: check if it's used and probably remove
	];
}
