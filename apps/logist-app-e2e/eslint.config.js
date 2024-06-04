const baseConfig = require('../../eslint.config.js');
const { compatConfig } = require('../../eslint.lib.config.js');

module.exports = [
	...baseConfig,
	...compatConfig(__dirname).extends('plugin:cypress/recommended'),
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {},
	},
];
