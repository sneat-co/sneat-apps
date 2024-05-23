const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const js = require('@eslint/js');

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

module.exports = [
	...baseConfig,
	...compat.extends('plugin:cypress/recommended'),
	...compat
		.config({
			extends: [
				'plugin:@nx/angular',
				'plugin:@angular-eslint/template/process-inline-templates',
			],
		})
		.map((config) => ({
			...config,
			files: ['**/*.ts'],
			rules: {
				...config.rules,
				'@angular-eslint/directive-selector': [
					'error',
					{
						type: 'attribute',
						prefix: 'sneat',
						style: 'camelCase',
					},
				],
				'@angular-eslint/component-selector': [
					'error',
					{
						type: 'element',
						prefix: 'sneat',
						style: 'kebab-case',
					},
				],
			},
		})),
	...compat
		.config({ extends: ['plugin:@nx/angular-template'] })
		.map((config) => ({
			...config,
			files: ['**/*.html'],
			rules: {
				...config.rules,
			},
		})),
	{
		files: ['**/*.cy.{ts,js,tsx,jsx}', 'cypress/**/*.{ts,js,tsx,jsx}'],
		rules: {},
	},
];
