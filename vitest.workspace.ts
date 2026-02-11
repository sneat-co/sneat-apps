/**
 * Vitest workspace configuration for the Sneat Apps monorepo.
 * This configures test discovery patterns for all projects in the workspace.
 *
 * Each project's individual vite.config.ts/mts file extends from vite.config.base.ts
 * which contains the shared coverage configuration and thresholds.
 */
export default [
  '**/vite.config.{mjs,js,ts,mts}',
  '**/vitest.config.{mjs,js,ts,mts}',
];
