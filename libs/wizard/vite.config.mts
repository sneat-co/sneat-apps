/// <reference types='vitest' />
import { defineConfig, mergeConfig } from 'vitest/config';
import { createBaseViteConfig } from '../../vite.config.base.mts';

export default defineConfig(() => {
	const baseConfig = createBaseViteConfig({
		dirname: __dirname,
		name: 'wizard',
	});
	return mergeConfig(baseConfig, {
		test: {
			server: {
				deps: {
					inline: ['@ionic/core', 'ionicons'],
				},
			},
		},
	});
});
