// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironmentConfig } from '@sneat/datatug/core';

const useEmulators = true;

export const environment: IEnvironmentConfig = {
	production: false,
	useEmulators,
	agents: {
		firestoreStoreAgent: useEmulators
			? 'http://localhost:4300/v0'
			: 'https://api.sneat.team/v0',
	},
	firebaseConfig: {
		apiKey: useEmulators
			? 'emulator-does-not-need-api-key'
			: 'AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw',
		authDomain: 'sneat.team',
		databaseURL: 'http://localhost:8080',
		projectId: useEmulators ? 'demo-sneat' : 'sneat-team',
		// 	storageBucket: 'sneat-team.appspot.com',
		// 	messagingSenderId: '724666284649',
		appId: '1:724666284649:web:080ffaab56bb71e49740f8',
		measurementId: 'G-RRM3BNCN0S',
	},
};
console.log('environment.useEmulators:', environment.useEmulators);

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
