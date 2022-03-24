import { appSpecificConfig, IEnvironmentConfig, prodEnvironmentConfig } from '@sneat/app';

const useEmulators = false;

// noinspection SpellCheckingInspection
export const environment: IEnvironmentConfig = appSpecificConfig(useEmulators, prodEnvironmentConfig, {
	firebase: {
		nickname: 'Sneat.app',
		apiKey: 'AIzaSyCxsZ2TxLSO9voSEhlHbmp5lto2xj0R2z8',
		appId: '1:5233273170:web:61e8d4f12d03a07e',
		measurementId: 'G-CMCYD6HVGN',
		messagingSenderId: '5233273170',
	},
});
