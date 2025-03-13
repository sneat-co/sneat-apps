import { IEnvironmentConfig, IFirebaseConfig } from '../lib/environment-config';
import { firebaseEmulatorConfig } from './environment.base';

export const firebaseConfigForSneatApp: IFirebaseConfig = {
	// emulator: firebaseEmulatorConfig,
	projectId: 'sneat-eur3-1',
	appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
	apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
	authDomain: 'sneat.app',
	messagingSenderId: '588648831063',
	measurementId: 'G-TYBDTV738R',
	// apiKey: 'AIzaSyCg0cZjGcZnF2xmQ9V_g2I6A88uZciZXTc',
	// authDomain: 'ionicvuefirebase-f42c6.firebaseapp.com',
	// projectId: 'ionicvuefirebase-f42c6',
	// storageBucket: 'ionicvuefirebase-f42c6.firebasestorage.app',
	// messagingSenderId: '769133939610',
	// appId: '1:769133939610:web:79ee61a7c6cac05d578823',
};

export const prodEnvironmentConfig: IEnvironmentConfig = {
	production: true,
	agents: {},
	firebaseConfig: firebaseConfigForSneatApp,
};
