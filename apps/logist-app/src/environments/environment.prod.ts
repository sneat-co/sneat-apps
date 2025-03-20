import { appSpecificConfig, prodEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const environment: IEnvironmentConfig = appSpecificConfig(
	prodEnvironmentConfig,
	// {
	// 	// firebase: prodEnvironmentConfig.firebaseConfig,
	// },
);
