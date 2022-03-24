import { appSpecificConfig, firebaseApiKey, IEnvironmentConfig, prodEnvironmentConfig } from '@sneat/app';

const useEmulators = false;

// noinspection SpellCheckingInspection
export const environment: IEnvironmentConfig = appSpecificConfig(useEmulators, prodEnvironmentConfig, {
	firebase: {
		nickname: 'Sneat.app',
		apiKey: firebaseApiKey(useEmulators, ''),
		appId: '',
		measurementId: '',
		messagingSenderId: '',
	},
});
