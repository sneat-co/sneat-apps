import {IEnvironmentConfig} from '@sneat/datatug/core';

export const environment: IEnvironmentConfig = {
	production: true,
	useEmulators: false,
	agents: {},
	firebaseConfig: {
		apiKey: 'AIzaSyCuSieAoHqI4JSPkbV33Uj423VuFpqi91Q',
		authDomain: 'sneat.team',
		databaseURL: 'https://sneat-team.firebaseio.com',
		projectId: 'sneat-team',
		// storageBucket: 'sneat-team.appspot.com',
		// messagingSenderId: '724666284649',
		appId: '1:724666284649:web:080ffaab56bb71e49740f8',
		measurementId: 'G-RRM3BNCN0S',
	},
};
