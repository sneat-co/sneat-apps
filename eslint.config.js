const { FlatCompat } = require('@eslint/eslintrc');
const nxEslintPlugin = require('@nx/eslint-plugin');
const eslintPluginJson = require('eslint-plugin-json');
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
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			...config.rules,
		},
	})),
	...compat.config({ extends: ['plugin:@nx/javascript'] }).map((config) => ({
		...config,
		files: ['**/*.js', '**/*.jsx'],
		rules: {
			...config.rules,
		},
	})),
	{
		files: ['**/*.html'],
		rules: { '@angular-eslint/template/prefer-self-closing-tags': ['error'] },
	},
	{ ignores: ['node_modules\r', 'src_old\r'] },
];
