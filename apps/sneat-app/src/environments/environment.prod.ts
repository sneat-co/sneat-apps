import { appSpecificConfig, prodEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const sneatAppEnvironmentConfig: IEnvironmentConfig = {
	...appSpecificConfig(prodEnvironmentConfig), // Not sure why we need this, needs to be documented or cleaned up
	posthog: {
		posthogKey: 'phc_YBZyRpV92s1kC0D4vYjEQiWhVjK7U9vfyi9vh2jfbsD',
		posthogHost: 'https://eu.i.posthog.com',
		person_profiles: 'identified_only',
	},
};
