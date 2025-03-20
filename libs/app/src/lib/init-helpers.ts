import { IEnvironmentConfig } from '@sneat/core';

function firebaseApiKey(useEmulators: boolean, apiKey: string): string {
	return useEmulators ? 'emulator-does-not-need-api-key' : apiKey;
}

export function firebaseProjectId(
	useEmulators: boolean,
	projectId: string,
): string {
	return useEmulators ? 'demo-' + projectId : projectId;
}

// function firebaseDatabaseURL(useEmulators: boolean, projectId: string): string | undefined{
// 	// noinspection SpellCheckingInspection
// 	return useEmulators
// 		? undefined :
// 		`https://${projectId}.firebaseio.com`;
// }

// TODO: document why needed
export function appSpecificConfig(
	envConfig: IEnvironmentConfig,
	// appConfig: IAppSpecificConfig,
): IEnvironmentConfig {
	let config: IEnvironmentConfig = {
		...envConfig,
		firebaseConfig: {
			...envConfig.firebaseConfig,
		},
	};
	const { firebaseConfig } = config;
	const useEmulator = !!config.firebaseConfig.emulator;
	const projectId = firebaseProjectId(useEmulator, firebaseConfig.projectId);
	config = {
		...config,
		firebaseConfig: {
			...firebaseConfig,
			apiKey: firebaseApiKey(useEmulator, firebaseConfig.apiKey),
			projectId: projectId,
		},
	};
	return config;
}
