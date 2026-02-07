/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { createBaseViteConfig } from '../../../../vite.config.base.mts';

export default defineConfig(() =>
	createBaseViteConfig({
		dirname: __dirname,
		name: 'ext-assetus-pages',
	}),
);
