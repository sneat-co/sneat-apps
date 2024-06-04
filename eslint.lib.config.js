const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

module.exports = {
	sneatLibConfig: (baseDirectory) => {
		const compat = new FlatCompat({
			baseDirectory: baseDirectory,
			recommendedConfig: js.configs.recommended,
		});
		config = [
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
		];
		return config;
	},
	compatConfig: (baseDirectory) => {
		const compat = new FlatCompat({
			baseDirectory: baseDirectory,
			recommendedConfig: js.configs.recommended,
		});

		return compat;
	},
};
