# Coverage Configuration

This document describes the test coverage configuration for the Sneat Apps monorepo.

## Overview

The repository uses Vitest for testing with coverage powered by the V8 provider. Coverage thresholds have been configured to establish quality gates for the codebase.

## Configuration Files

### vitest.workspace.ts

The workspace configuration file that defines test discovery patterns for all projects in the monorepo:

```typescript
export default ['**/vite.config.{mjs,js,ts,mts}', '**/vitest.config.{mjs,js,ts,mts}'];
```

Each individual project's configuration extends from `vite.config.base.ts`, which contains shared coverage settings.

### vite.config.base.ts

The base Vite configuration that all projects inherit from. It includes:

#### Coverage Settings

- **Provider**: V8 (fast native coverage)
- **Reporters**:
  - `text` - Console output
  - `json` - Machine-readable format
  - `json-summary` - Compact summary format
  - `html` - Interactive HTML reports
- **All files tracking**: Enabled (`all: true`) to track all source files, even untested ones
- **Include patterns**: `src/**/*.ts` (all TypeScript source files)
- **Exclude patterns**:
  - `src/**/*.spec.ts` - Test files
  - `src/**/test-setup.ts` - Test setup files
  - `src/**/*.stories.ts` - Storybook files
  - `src/**/index.ts` - Barrel export files

#### Coverage Thresholds

Current baseline thresholds (will fail tests if not met):

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 35%       |
| Functions  | 35%       |
| Branches   | 30%       |
| Statements | 35%       |

**Note**: These are baseline thresholds set to the current coverage level. The target is to reach 75% coverage over time.

## Running Coverage Analysis

### Generate Coverage for All Projects

```bash
# Run tests with coverage
pnpm nx run-many --target=test --all --coverage.enabled=true

# Analyze uncovered lines
pnpm run coverage:analyze
```

### Generate Coverage for a Single Project

```bash
# Run test with coverage for a specific project
pnpm nx test <project-name> --coverage.enabled=true

# Example
pnpm nx test core --coverage.enabled=true
```

### View Coverage Reports

After running tests with coverage, HTML reports are generated in:

```
coverage/<project-path>/index.html
```

For example:

- `coverage/libs/core/index.html`
- `coverage/libs/components/index.html`
- `coverage/apps/sneat-app/index.html`

## Quality Gates

The coverage thresholds act as quality gates:

1. **Build-time**: Tests will fail if coverage drops below the threshold
2. **CI/CD**: Can be enforced in continuous integration pipelines
3. **Local Development**: Developers get immediate feedback on coverage

## Improving Coverage

To improve test coverage in your project:

1. Run coverage analysis to identify uncovered code:

   ```bash
   pnpm run coverage:analyze
   ```

2. Focus on projects with the most uncovered lines (output is sorted by priority)

3. Add tests for uncovered code

4. Verify improvements:

   ```bash
   pnpm nx test <project-name> --coverage.enabled=true
   ```

5. As project coverage improves, consider increasing thresholds locally in the project's `vite.config.mts`

## Project-Specific Thresholds

Individual projects can override the base thresholds. Example in `libs/my-lib/vite.config.mts`:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import { createBaseViteConfig } from '../../vite.config.base';

export default defineConfig(() => {
  const baseConfig = createBaseViteConfig({
    dirname: __dirname,
    name: 'my-lib',
  });

  return mergeConfig(baseConfig, {
    test: {
      coverage: {
        thresholds: {
          lines: 80, // Higher threshold for this project
          functions: 80,
          branches: 75,
          statements: 80,
        },
      },
    },
  });
});
```

## CI/CD Integration

The configuration supports multiple output formats for different use cases:

- **text**: Human-readable console output
- **json**: For programmatic parsing
- **json-summary**: Compact summary for badges or status checks
- **html**: Interactive reports for detailed analysis

These can be used to:

- Generate coverage badges
- Post coverage comments on PRs
- Track coverage trends over time
- Block merges if coverage drops

## References

- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage.html)
- [Coverage Configuration Options](https://vitest.dev/config/#coverage)
- Project Script: `scripts/list-uncovered-lines.mjs`
