// Shared Sneat lint configuration helpers for Nx libs and apps
// Minimal implementation to unblock linting across packages.

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

/**
 * Returns additional flat config entries for a given package directory.
 * For now, we keep it empty to rely on the root eslint.config.js.
 * @param {string} _dir absolute path to the package directory
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
function sneatLibConfig(_dir) {
	return [];
}

/**
 * Provides a FlatCompat instance scoped to a package directory, so per-package
 * legacy config fragments can be converted in their own base directory.
 * This mirrors the compat used in the root eslint.config.js.
 */
function compatConfig(baseDirectory) {
	return new FlatCompat({
		baseDirectory,
		recommendedConfig: js.configs.recommended,
	});
}

module.exports = { sneatLibConfig, compatConfig };
