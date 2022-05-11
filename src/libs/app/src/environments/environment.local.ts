import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';

const useEmulators = true;


const firebaseConfig: IFirebaseConfig = {
	useEmulators,
	emulator: {
		authPort: 9099,
		firestorePort: 8080,
	},
	apiKey: 'AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw',
	authDomain: 'sneat.app',
	projectId: 'local-sneat-app',
	// 	storageBucket: 'sneat-team.appspot.com',
	// 	messagingSenderId: '724666284649',
	appId: '1:724666284649:web:080ffaab56bb71e49740f8',
	measurementId: 'G-RRM3BNCN0S',
};

export const localEnvironmentConfig: IEnvironmentConfig = {
	production: false,
	useEmulators,
	agents: {},
	firebaseConfig,
};

