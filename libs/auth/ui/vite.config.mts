/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../../node_modules/.vite/libs/auth/ui',
	plugins: [
		angular({
			jit: true,
			tsconfig: './tsconfig.spec.json',
		}),
		nxViteTsPaths(),
	],
	test: {
		name: 'auth-ui',
		watch: false,
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		setupFiles: ['src/test-setup.ts'],
		reporters: ['default'],
		coverage: {
			reportsDirectory: '../../../coverage/libs/auth/ui',
			provider: 'v8' as const,
		},
	},
}));
