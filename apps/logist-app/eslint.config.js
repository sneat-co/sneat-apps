const baseConfig = require('../../eslint.config.js');

const { sneatLibConfig } = require('../../eslint.lib.config.js');

module.exports = [
  ...baseConfig,
  ...sneatLibConfig(__dirname),
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
];
