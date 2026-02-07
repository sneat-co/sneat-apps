import { ViteUserConfigExport } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'path';

export interface BaseViteConfigOptions {
	dirname: string;
	name: string;
	reportsDirectory?: string;
}

export function createBaseViteConfig(
	options: BaseViteConfigOptions,
): ViteUserConfigExport {
	const { dirname, name, reportsDirectory } = options;

	// Better way to calculate relative path to root based on distance from root
	const rootPath = process.cwd();
	const relativeToRoot = join(
		dirname,
		Array(dirname.replace(rootPath, '').split('/').filter(Boolean).length)
			.fill('..')
			.join('/'),
		'node_modules/.vite',
		dirname.replace(rootPath, ''),
	);
	const coverageDir = join(
		dirname,
		Array(dirname.replace(rootPath, '').split('/').filter(Boolean).length)
			.fill('..')
			.join('/'),
		'coverage',
		dirname.replace(rootPath, ''),
	);

	return {
		root: dirname,
		cacheDir: relativeToRoot,
		plugins: [
			angular({
				jit: true,
				tsconfig: './tsconfig.spec.json',
			}),
			nxViteTsPaths(),
		],
		test: {
			name,
			watch: false,
			globals: true,
			environment: 'jsdom',
			include: ['src/**/*.spec.ts'],
			setupFiles: ['src/test-setup.ts'],
			reporters: ['default'],
			coverage: {
				reportsDirectory: reportsDirectory || coverageDir,
				provider: 'v8' as const,
			},
		},
	} as ViteUserConfigExport;
}
