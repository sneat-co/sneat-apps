// ESM version of the ESLint flat config for this package.
// The package.json here has { "type": "module" }, so CommonJS `require`
// is not available. Convert to ESM and import the root CJS configs via default.

import baseConfig from '../../../eslint.config.js';
import { sneatLibConfig } from '../../../eslint.lib.config.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
	...baseConfig,
	...sneatLibConfig(__dirname),
	{
		files: ['**/*.ts'],
		rules: {
			'@angular-eslint/prefer-standalone': 'off',
		},
	},
];
