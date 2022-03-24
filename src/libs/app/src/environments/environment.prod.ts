import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';

const useEmulators = false;

const firebaseConfig: IFirebaseConfig = {
	apiKey: 'AIzaSyAYGGhSQQ8gUcyPUcUOFW7tTSYduRD3cuw',
	authDomain: 'sneat.team',
	projectId: 'sneat-team',
	// 	storageBucket: 'sneat-team.appspot.com',
	// 	messagingSenderId: '724666284649',
	appId: '1:724666284649:web:080ffaab56bb71e49740f8',
	measurementId: 'G-RRM3BNCN0S',
};

export const prodEnvironmentConfig: IEnvironmentConfig = {
	production: true,
	useEmulators,
	agents: {},
	firebaseConfig,
};
