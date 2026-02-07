import { defineConfig } from 'vitest/config';
import { createBaseViteConfig } from '../../../vite.config.base.mts';

export default defineConfig(() =>
	createBaseViteConfig({
		dirname: __dirname,
		name: 'contactus-shared',
	}),
);
