import { IEnvironmentConfig } from '../lib/environment-config';
import { baseEnvironmentConfig } from './environment.base';

const useEmulators = true;

export const environmentConfig: IEnvironmentConfig = {
	...baseEnvironmentConfig,
	useEmulators,
};
