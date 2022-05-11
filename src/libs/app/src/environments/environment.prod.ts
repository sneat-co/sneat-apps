import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';

const useEmulators = false;

export function isSneatTeam(): boolean {
	const { hostname } = location;
	return hostname === 'sneat.team'
		|| hostname === 'datatug.app'
		|| hostname.startsWith('sneat-team');
}

export const firebaseConfigForSneatApp: IFirebaseConfig = {
	apiKey: "AIzaSyA7xKWO_2YWa6u7VQ32fWnpgC-BbDZYsEA",
	authDomain: "sneat.app",
	projectId: "sneat-eu",
	messagingSenderId: "802813395701",
	appId: "1:802813395701:web:5f7f36d74bd3d4a35c3bbc",
	measurementId: "G-J7WLMWPCJW"
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
	firebaseConfig: isSneatTeam() ? firebaseConfigForSneatTeam : firebaseConfigForSneatApp,
};
