import { appSpecificConfig, prodEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const sneatAppEnvironmentConfig: IEnvironmentConfig = {
	...appSpecificConfig(prodEnvironmentConfig), // TODO: Not sure why we need this, needs to be documented or cleaned up
	posthog: {
		token: 'phc_YBZyRpV92s1kC0D4vYjEQiWhVjK7U9vfyi9vh2jfbsD',
		config: {
			api_host: 'https://eu.i.posthog.com',
			person_profiles: 'identified_only',
		},
	},
	sentry: {
		dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
	},
};
