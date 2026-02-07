/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import { createBaseViteConfig } from '../../../vite.config.base';

export default defineConfig(() =>
	createBaseViteConfig({
		dirname: __dirname,
		name: 'contactus-core',
	}),
);
