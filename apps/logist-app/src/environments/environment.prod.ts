import { appSpecificConfig, prodEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const logistAppEnvironmentConfig: IEnvironmentConfig = appSpecificConfig(
  prodEnvironmentConfig,
  // {
  // 	// firebase: prodEnvironmentConfig.firebaseConfig,
  // },
);
