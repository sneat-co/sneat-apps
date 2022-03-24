// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { appSpecificConfig, firebaseApiKey, IEnvironmentConfig, localEnvironmentConfig } from '@sneat/app';

const useEmulators = true;

// noinspection SpellCheckingInspection
export const environment: IEnvironmentConfig = appSpecificConfig(useEmulators, localEnvironmentConfig, {
	firebase: {
		nickname: 'Sneat.app',
		apiKey: firebaseApiKey(useEmulators, ''),
		appId: '',
		measurementId: '',
		messagingSenderId: '',
	},
});
