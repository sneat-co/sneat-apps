import { appSpecificConfig, IEnvironmentConfig, IFirebaseConfig, prodEnvironmentConfig } from '@sneat/app';

const useEmulators = false;

export const environment: IEnvironmentConfig = appSpecificConfig(useEmulators, prodEnvironmentConfig, {
	// firebase: prodEnvironmentConfig.firebaseConfig,
});
