import { appSpecificConfig, prodEnvironmentConfig, } from '@sneat/app';
const useEmulators = false;
export const environment = appSpecificConfig(useEmulators, prodEnvironmentConfig, {
// firebase: prodEnvironmentConfig.firebaseConfig,
});
//# sourceMappingURL=environment.prod.js.map