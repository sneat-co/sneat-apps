// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {
	appSpecificConfig,
	IEnvironmentConfig,
	environmentConfig,
} from '@sneat/app';

// noinspection SpellCheckingInspection
export const environment: IEnvironmentConfig = appSpecificConfig(
	environmentConfig,
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
