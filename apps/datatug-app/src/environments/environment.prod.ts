import {
	appSpecificConfig,
	IEnvironmentConfig,
	prodEnvironmentConfig,
} from '@sneat/app';

// noinspection SpellCheckingInspection
export const environment: IEnvironmentConfig = appSpecificConfig(
	prodEnvironmentConfig,
	// {
	// 	firebase: {
	// 		nickname: 'DataTug',
	// 		apiKey: 'AIzaSyAbEG6aIiKqT8C5mmZav3oSoZSnFOPUnos',
	// 		appId: '1:724666284649:web:4dd15246f4573a459740f8',
	// 		measurementId: 'G-LTKKFRWV0M',
	// 		messagingSenderId: '724666284649',
	// 	},
	// },
);
