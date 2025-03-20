import {
	IEnvironmentConfig,
	IFirebaseConfig,
	IFirebaseEmulatorConfig,
} from '../lib/environment-config';
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';

const useNgrok = window.location.hostname.includes('.ngrok.');
const useSSL = useNgrok || window.location.hostname == 'local-app.sneat.ws';

// const nonSecureEmulatorHost = '127.0.0.1'; // 'localhost';
const nonSecureEmulatorHost = '127.0.0.1'; // 'localhost';

export const firebaseEmulatorConfig: IFirebaseEmulatorConfig = {
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
};

export const notNeededForEmulator = 'not-needed-for-emulator';

const firebaseConfig: IFirebaseConfig = {
	emulator: firebaseEmulatorConfig,
	apiKey: notNeededForEmulator,
	authDomain: 'sneat.app',
	projectId: 'local-sneat-app', // The 'demo-' prefix is added if useEmulators is true
	appId: notNeededForEmulator,
	measurementId: 'G-PROVIDE_IF_NEEDED',
};

export const baseEnvironmentConfig: IEnvironmentConfig = {
	production: false,
	useNgrok,
	agents: {},
	firebaseConfig,
};
