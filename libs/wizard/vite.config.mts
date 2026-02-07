/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
	root: __dirname,
	cacheDir: '../../node_modules/.vite/libs/wizard',
	plugins: [
		angular({
			jit: true,
			tsconfig: './tsconfig.spec.json',
		}),
		nxViteTsPaths(),
	],
	test: {
		name: 'wizard',
		watch: false,
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.spec.ts'],
		setupFiles: ['src/test-setup.ts'],
		reporters: ['default'],
		server: {
			deps: {
				inline: ['@ionic/core', 'ionicons'],
			},
		},
		coverage: {
			reportsDirectory: '../../coverage/libs/wizard',
			provider: 'v8' as const,
		},
	},
}));
