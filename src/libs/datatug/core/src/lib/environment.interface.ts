import {InjectionToken} from '@angular/core';

export interface IFirebaseConfig {
	projectId: string;
	appId: string;
	measurementId: string;
	apiKey: string;
	authDomain: string;
	databaseURL: string;
}

export interface IEnvironmentConfig {
	production: boolean;
	useEmulators: boolean;
	agents: {[id: string]: string};
	firebaseConfig: IFirebaseConfig;
}

export const EnvConfigToken = new InjectionToken('envConfig');
