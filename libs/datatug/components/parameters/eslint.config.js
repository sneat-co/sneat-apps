const baseConfig = require('../../../../eslint.config.js');
const {
	sneatLibConfig,
	compatConfig,
} = require('../../../../eslint.lib.config.js');

module.exports = [
	...baseConfig,
	...sneatLibConfig(__dirname),
	...compatConfig(__dirname)
		.config({ parser: 'jsonc-eslint-parser' })
		.map((config) => ({
			...config,
			files: ['**/*.json-TODO'],
			rules: {
				...config.rules,
				'@nx/dependency-checks': 'error',
			},
		})),
];
