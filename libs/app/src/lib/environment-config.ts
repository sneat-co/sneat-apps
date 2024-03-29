import { InjectionToken } from '@angular/core';

export interface IFirebaseEmulatorConfig {
	host: '127.0.0.1' | 'localhost';
	authPort: number;
	firestorePort: number;
}

export interface IFirebaseConfig {
	useEmulators?: boolean;
	emulator?: IFirebaseEmulatorConfig;
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
	agents: Record<string, string>;
	firebaseConfig: IFirebaseConfig;
	firebaseBaseUrl?: string;
}

export const FirebaseConfigToken = new InjectionToken<IFirebaseConfig>(
	'firebaseConfig',
);
export const EnvConfigToken = new InjectionToken<IEnvironmentConfig>(
	'envConfig',
);
