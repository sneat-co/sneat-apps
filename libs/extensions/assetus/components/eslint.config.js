// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseConfig = require('../../../../eslint.config.js');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { sneatLibConfig } = require('../../../../eslint.lib.config.js');

module.exports = [...baseConfig, ...sneatLibConfig(__dirname)];
