import {
	appSpecificConfig,
	IEnvironmentConfig,
	prodEnvironmentConfig,
} from '@sneat/app';

export const environment: IEnvironmentConfig = appSpecificConfig(
	prodEnvironmentConfig,
	// {
	// 	// firebase: prodEnvironmentConfig.firebaseConfig,
	// },
);
