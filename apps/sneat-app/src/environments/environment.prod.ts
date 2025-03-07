import {
	appSpecificConfig,
	IEnvironmentConfig,
	prodEnvironmentConfig,
} from '@sneat/app';

export const sneatAppEnvironmentConfig: IEnvironmentConfig = appSpecificConfig(
	prodEnvironmentConfig,
);
