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
	...compat.config({ extends: ['plugin:@nx/typescript'] }).map((config) => ({
		...config,
		files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
		rules: {
			...config.rules,
		},
	})),
	...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
		...config,
		files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
		rules: {
			...config.rules,
		},
	})),
	{
		ignores: ['node_modules', 'src_old'],
	},
];
