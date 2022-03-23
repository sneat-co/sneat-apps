import { IEnvironmentConfig } from './environment-config';

export function firebaseApiKey(useEmulators: boolean, apiKey: string): string {
	return useEmulators ? 'emulator-does-not-need-api-key' : apiKey;
}

export function firebaseProjectId(useEmulators: boolean, projectId: string): string {
	return useEmulators ? 'demo-sneat' : projectId;
}

export function firebaseDatabaseURL(useEmulators: boolean, v: string): string {
	return useEmulators ? 'http://localhost:8080' : v;
}

interface IFirebaseAppSpecificConfig {
	nickname: string;
	apiKey: string;
	appId: string;
	measurementId: string;
	messagingSenderId: string;
}

export interface IAppSpecificConfig {
	firebase: IFirebaseAppSpecificConfig;
}

export function appSpecificConfig(envConfig: IEnvironmentConfig, appConfig: IAppSpecificConfig): IEnvironmentConfig {
	return {
		...envConfig,
		firebaseConfig: {
			...envConfig.firebaseConfig,
			...appConfig.firebase,
		},
	};
}
