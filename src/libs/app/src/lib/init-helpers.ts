import { IEnvironmentConfig } from './environment-config';

function firebaseApiKey(useEmulators: boolean, apiKey: string): string {
	return useEmulators ? 'emulator-does-not-need-api-key' : apiKey;
}

function firebaseProjectId(useEmulators: boolean, projectId: string): string {
	return useEmulators ? 'demo-' + projectId : projectId;
}

function firebaseDatabaseURL(useEmulators: boolean, projectId: string): string | undefined{
	// noinspection SpellCheckingInspection
	return useEmulators
		? undefined :
		`https://${projectId}.firebaseio.com`;
}

interface IFirebaseAppSpecificConfig {
	nickname: string;
	apiKey: string;
	appId: string;
	measurementId: string;
	messagingSenderId: string;
}

export interface IAppSpecificConfig {
	firebase?: IFirebaseAppSpecificConfig;
}

export function appSpecificConfig(useEmulators: boolean, envConfig: IEnvironmentConfig, appConfig: IAppSpecificConfig): IEnvironmentConfig {
	let config: IEnvironmentConfig = {
		...envConfig,
		useEmulators,
		firebaseConfig: {
			...envConfig.firebaseConfig,
			...appConfig.firebase,
		},
	};
	const projectId = firebaseProjectId(useEmulators, config.firebaseConfig.projectId);
	config = {
		...config,
		firebaseConfig: {
			...config.firebaseConfig,
			apiKey: firebaseApiKey(useEmulators, config.firebaseConfig.apiKey),
			projectId: projectId,
			databaseURL: firebaseDatabaseURL(useEmulators, projectId),
		},
	};
	return config;
}
