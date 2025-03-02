import {
	appSpecificConfig,
	IEnvironmentConfig,
	prodEnvironmentConfig,
} from '@sneat/app';

const useEmulators = false;

export const sneatAppEnvironmentConfig: IEnvironmentConfig = appSpecificConfig(
	useEmulators,
	prodEnvironmentConfig,
	{
		// firebase: prodEnvironmentConfig.firebaseConfig,
	},
);
