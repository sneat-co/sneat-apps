import { InjectionToken } from '@angular/core';

export interface IFirebaseEmulatorConfig {
	authPort: number;
	authHost?: string;
	firestorePort: number;
	firestoreHost?: string;
}

export interface IFirebaseConfig {
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

export interface IPosthogConfig {
	posthogKey: string;
	posthogHost: string;
	person_profiles?: 'always' | 'never' | 'identified_only';
}

export interface IEnvironmentConfig {
	production: boolean;
	useNgrok?: boolean;
	posthog?: IPosthogConfig;
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
