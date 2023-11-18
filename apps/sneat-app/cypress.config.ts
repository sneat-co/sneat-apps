import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

const cypressConfig = defineConfig({
	e2e: {
		...nxE2EPreset(__filename, { cypressDir: 'cypress' }),
		specPattern: 'cypress/e2e/**/*.e2e.spec.ts',
		baseUrl: 'http://localhost:4205',
	},
	chromeWebSecurity: false,
	trashAssetsBeforeRuns: true,
	requestTimeout: 10000,
	retries: {
		runMode: 2,
		openMode: 0,
	},
});

export default cypressConfig;
