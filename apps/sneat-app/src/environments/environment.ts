// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { appSpecificConfig, environmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

// See environment.prod.ts for production environment configuration
export const sneatAppEnvironmentConfig: IEnvironmentConfig =
	appSpecificConfig(environmentConfig);
