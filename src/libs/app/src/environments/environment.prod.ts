import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';

const useEmulators = false;

export function isSneatTeam(): boolean {
	const { hostname } = location;
	return hostname === 'sneat.team'
		|| hostname === 'datatug.app'
		|| hostname.startsWith('sneat-team');
}

export const firebaseConfigForSneatApp: IFirebaseConfig = {
	apiKey: 'AIzaSyCxsZ2TxLSO9voSEhlHbmp5lto2xj0R2z8',
	authDomain: 'sneatapp.firebaseapp.com',
	databaseURL: 'https://sneatapp.firebaseio.com',
	projectId: 'sneatapp',
	storageBucket: 'sneatapp.appspot.com',
	messagingSenderId: '5233273170',
	appId: '1:5233273170:web:61e8d4f12d03a07e',
	measurementId: 'G-CMCYD6HVGN',
};

export const firebaseConfigForSneatTeam: IFirebaseConfig = {
	apiKey: 'AIzaSyCuSieAoHqI4JSPkbV33Uj423VuFpqi91Q',
	authDomain: 'sneat-team.firebaseapp.com',
	databaseURL: 'https://sneat-team.firebaseio.com',
	projectId: 'sneat-team',
	storageBucket: 'sneat-team.appspot.com',
	messagingSenderId: '724666284649',
	appId: '1:724666284649:web:080ffaab56bb71e49740f8',
	measurementId: 'G-RRM3BNCN0S',
};

export const prodEnvironmentConfig: IEnvironmentConfig = {
	production: true,
	useEmulators,
	agents: {},
	firebaseConfig: isSneatTeam() ? firebaseConfigForSneatTeam : firebaseConfigForSneatApp,
};
