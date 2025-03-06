import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';
import { firebaseEmulatorConfig } from './environment.base';

const useEmulators = false;

export function isSneatHost(): boolean {
	const { hostname } = location;
	return (
		hostname === 'sneat.team' ||
		hostname === 'datatug.app' ||
		hostname.startsWith('sneat-team')
	);
}

export const firebaseConfigForSneatApp: IFirebaseConfig = {
	useEmulators: true,
	emulator: firebaseEmulatorConfig,
	apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
	authDomain: 'sneat.app',
	projectId: 'sneat-eur3-1',
	// storageBucket: 'sneat-eur3-1.appspot.com',
	messagingSenderId: '588648831063',
	appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
	measurementId: 'G-TYBDTV738R',
	// apiKey: 'AIzaSyA7xKWO_2YWa6u7VQ32fWnpgC-BbDZYsEA',
	// authDomain: 'sneat.app',
	// projectId: 'sneat-eu',
	// messagingSenderId: '802813395701',
	// appId: '1:802813395701:web:5f7f36d74bd3d4a35c3bbc',
	// measurementId: 'G-J7WLMWPCJW',
};

export const firebaseConfigForSneatTeam: IFirebaseConfig = {
	apiKey: 'AIzaSyCuSieAoHqI4JSPkbV33Uj423VuFpqi91Q',
	authDomain: 'sneat-team.firebaseapp.com',
	databaseURL: 'https://sneat-team.firebaseio.com',
	projectId: 'sneat-team',
	messagingSenderId: '724666284649',
	appId: '1:724666284649:web:080ffaab56bb71e49740f8',
	measurementId: 'G-RRM3BNCN0S',
};

export const prodEnvironmentConfig: IEnvironmentConfig = {
	production: true,
	useEmulators,
	agents: {},
	firebaseConfig: isSneatHost()
		? firebaseConfigForSneatTeam
		: firebaseConfigForSneatApp,
};
