import { EnvironmentProviders, Provider } from '@angular/core';
import { provideAppInfo, provideRolesByType } from '@sneat/app';
import { provideSentryAppInitializer } from '@sneat/logging';

export function getProviders(): Array<Provider | EnvironmentProviders> {
	return [
		provideSentryAppInitializer(),
		provideAppInfo({ appId: 'sneat', appTitle: 'sneat.app' }),
		provideRolesByType(undefined),
	];
}
