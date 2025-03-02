import { Provider } from '@angular/core';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { coreProviders } from '@sneat/core';
import { sentryAppInitializerProviders } from '@sneat/logging';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { IEnvironmentConfig } from './environment-config';
import { getAngularFireProviders } from './init-firebase';

export function getStandardSneatProviders(
	environmentConfig: IEnvironmentConfig,
): readonly Provider[] {
	return [
		...coreProviders,
		...sentryAppInitializerProviders,
		getAngularFireProviders(environmentConfig.firebaseConfig),
		{
			provide: SneatApiBaseUrl,
			useValue: environmentConfig.useNgrok
				? `//${location.host}/v0/`
				: environmentConfig.useEmulators
					? 'https://local-api.sneat.ws/v0/' // 'http://localhost:4300/v0/'
					: DefaultSneatAppApiBaseUrl,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
	];
}
