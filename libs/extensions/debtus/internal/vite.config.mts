/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import { createBaseViteConfig } from '../../../../vite.config.base';

export default defineConfig(() =>
	createBaseViteConfig({
		dirname: __dirname,
		name: 'ext-debtus-internal',
		// This project only has a sanity test; disable coverage thresholds
		// until real tests are added (see @analogjs/vite-plugin-angular 2.5.0
		// which changed how uncovered source files appear in coverage reports).
		coverageThresholds: { lines: 0, statements: 0, branches: 0, functions: 0 },
	}),
);
