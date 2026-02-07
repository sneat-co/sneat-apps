const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function findTsConfigSpecFiles(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		file = path.join(dir, file);
		const stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			if (!file.includes('node_modules') && !file.includes('.nx')) {
				results = results.concat(findTsConfigSpecFiles(file));
			}
		} else if (file.endsWith('tsconfig.spec.json')) {
			results.push(file);
		}
	});
	return results;
}

const specFiles = findTsConfigSpecFiles(path.join(rootDir, 'libs'));

const workingConfig = {
	extends: './tsconfig.json',
	compilerOptions: {
		outDir: '../../dist/out-tsc',
		types: [
			'vitest/globals',
			'vitest/importMeta',
			'vite/client',
			'node',
			'vitest',
		],
	},
	include: [
		'vite.config.ts',
		'vite.config.mts',
		'vitest.config.ts',
		'vitest.config.mts',
		'src/**/*.test.ts',
		'src/**/*.spec.ts',
		'src/**/*.test.tsx',
		'src/**/*.spec.tsx',
		'src/**/*.test.js',
		'src/**/*.spec.js',
		'src/**/*.test.jsx',
		'src/**/*.spec.jsx',
		'src/**/*.d.ts',
	],
	files: ['src/test-setup.ts'],
};

specFiles.forEach((file) => {
	if (file.includes('libs/api/tsconfig.spec.json')) return; // skip api

	try {
		let content = fs.readFileSync(file, 'utf8');
		// Fix common JSON errors like trailing commas or leading commas in arrays
		content = content.replace(/,\s*([\]}])/g, '$1'); // Trailing commas
		content = content.replace(/\[\s*,/g, '['); // Leading commas in arrays

		let config;
		try {
			config = JSON.parse(content);
		} catch (e) {
			console.error(`Failed to parse ${file}: ${e.message}`);
			return;
		}

		// Update outDir to be relative
		const depth =
			file.replace(rootDir, '').split(path.sep).filter(Boolean).length - 1;
		const outDir = '../'.repeat(depth) + 'dist/out-tsc';

		const newConfig = {
			...config,
			extends: config.extends || './tsconfig.json',
			compilerOptions: {
				...config.compilerOptions,
				outDir: outDir,
				types: Array.from(
					new Set([
						...(config.compilerOptions?.types || []),
						...workingConfig.compilerOptions.types,
					]),
				),
			},
			include: workingConfig.include,
			files: workingConfig.files,
		};

		fs.writeFileSync(file, JSON.stringify(newConfig, null, 2));
		console.log(`Updated ${file}`);
	} catch (e) {
		console.error(`Failed to update ${file}: ${e.message}`);
	}
});
