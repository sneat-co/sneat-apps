// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseConfig = require('../../eslint.config.js');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { compatConfig } = require('../../eslint.lib.config.js');

module.exports = [
	...baseConfig,
	...compatConfig(__dirname).extends('plugin:cypress/recommended'),
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
];
