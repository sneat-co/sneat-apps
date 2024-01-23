import { InjectionToken } from '@angular/core';

export interface IFirebaseConfig {
	useEmulators?: boolean;
	emulator?: {
		host: '127.0.0.1' | 'localhost';
		authPort: number;
		firestorePort: number;
	};
	//
	projectId: string;
	appId: string;
	measurementId?: string;
	messagingSenderId?: string;
	apiKey: string;
	authDomain: string;
	databaseURL?: string;
	storageBucket?: string;
}

export interface IEnvironmentConfig {
	production: boolean;
	useEmulators: boolean;
	agents: { [id: string]: string };
	firebaseConfig: IFirebaseConfig;
	firebaseBaseUrl?: string;
}

export const FirebaseConfigToken = new InjectionToken<IFirebaseConfig>(
	'firebaseConfig',
);
export const EnvConfigToken = new InjectionToken<IEnvironmentConfig>(
	'envConfig',
);
