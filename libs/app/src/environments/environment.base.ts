import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';

const useEmulators = true;

const useNgrok = window.location.hostname.includes('.ngrok.');
const useSSL = useNgrok || window.location.hostname == 'local-app.sneat.ws';

const nonSecureEmulatorHost = '127.0.0.1'; // 'localhost';

const firebaseConfig: IFirebaseConfig = {
	useEmulators,
	emulator: {
		authPort: useSSL ? 443 : 9099,
		authHost: useNgrok
			? window.location.hostname
			: useSSL
				? 'local-fb-auth.sneat.ws'
				: nonSecureEmulatorHost,
		firestorePort: useSSL ? 443 : 8080,
		firestoreHost: useNgrok
			? window.location.hostname
			: useSSL
				? 'local-firestore.sneat.ws'
				: nonSecureEmulatorHost,
	},
	apiKey: 'AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw',
	authDomain: 'sneat.app',
	projectId: 'local-sneat-app', // The 'demo-' prefix is added if useEmulators is true
	// 	storageBucket: 'sneat-team.appspot.com',
	// 	messagingSenderId: '724666284649',
	appId: '1:724666284649:web:080ffaab56bb71e49740f8',
	measurementId: 'G-RRM3BNCN0S',
};

export const baseEnvironmentConfig: IEnvironmentConfig = {
	production: false,
	useEmulators,
	useNgrok,
	agents: {},
	firebaseConfig,
};
