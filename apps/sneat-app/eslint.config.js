// ESM version of the ESLint flat config for this app.
// apps/sneat-app/package.json likely has { "type": "module" }, so CommonJS `require`
// is not available. Use ESM imports and export default.

import baseConfig from '../../eslint.config.js';
import { sneatLibConfig } from '../../eslint.lib.config.js';
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
