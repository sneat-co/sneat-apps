const { FlatCompat } = require('@eslint/eslintrc');
const nxEslintPlugin = require('@nx/eslint-plugin');
const eslintPluginJson = require('eslint-plugin-json');
const pluginTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    plugins: {
      '@nx': nxEslintPlugin,
      json: eslintPluginJson,
      template: pluginTemplatePlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...compat.config({ extends: ['plugin:@nx/typescript'] }).map((config) =>
    Object.assign(config, {
      files: [`**/*.ts`, `**/*.tsx`, `**/*.cts`, `**/*.mts`],
      rules: { ...config.rules },
    }),
  ),
  ...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) =>
    Object.assign(config, {
      files: [`**/*.js`, `**/*.jsx`, `**/*.cjs`, `**/*.mjs`],
      rules: { ...config.rules },
    }),
  ),
  {
    ignores: ['node_modules', 'src_old', '**/vitest.config.*.timestamp*'],
  },
  // Ensure config files and test-setup files can import other local config via relative paths without triggering module-boundaries.
  // Keep this at the very end so it has the highest precedence.
  {
    files: [
      '**/eslint.config.*',
      '**/.eslintrc.*',
      '**/test-setup.ts',
      'libs/core/src/lib/anaylytics/*.service.ts',
      'libs/core/src/lib/anaylytics/provide-sneat-analytics.ts',
    ],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
