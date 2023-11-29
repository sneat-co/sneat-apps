import { IEnvironmentConfig } from '../lib/environment-config';
import { baseEnvironmentConfig } from './environment.base';

const useEmulators = true;

export const environmentConfig: IEnvironmentConfig = {
	...baseEnvironmentConfig,
	useEmulators,
	firebaseBaseUrl: '127.0.0.1',
};
