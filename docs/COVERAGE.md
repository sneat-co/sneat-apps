# Test Coverage Badge Setup

The repository includes automatic test coverage collection and badge generation for the main branch.

## How It Works

1. On every push to `main`, the GitHub Actions workflow runs tests with coverage enabled for all affected projects
2. Coverage reports from all projects are merged into a single summary
3. A coverage badge is automatically generated and committed back to the repository
4. The badge appears in the README showing the current test coverage percentage

## Badge Location

The coverage badge SVG is stored at `.github/badges/coverage.svg` and displayed in the README.

## Workflow Configuration

The coverage workflow is defined in `.github/workflows/build-nx.yml` and includes:
- Running affected tests with coverage: `pnpm run nx affected --target=test --coverage`
- Merging coverage reports from all projects
- Generating the badge using `jaywcjlove/coverage-badges-cli@v1`
- Committing the badge back to the repository

## Branch Protection Settings

If you have branch protection rules enabled on `main`, you need to allow the workflow to commit:

1. Go to repository **Settings** → **Branches** → **Branch protection rules** for `main`
2. Enable "Allow specified actors to bypass required pull requests"
3. Add the "github-actions" app to the allowed actors

Alternatively, the workflow can be modified to create a pull request instead of committing directly.

## Coverage Thresholds

Coverage thresholds are configured in `vite.config.base.ts`:
- Lines: 35%
- Functions: 35%
- Branches: 30%
- Statements: 35%

These can be adjusted per-project by modifying the individual `vite.config.mts` files.

## Manual Coverage Collection

To run tests with coverage locally:

```bash
# Run coverage for all projects
pnpm nx run-many --target=test --all --coverage

# Run coverage for affected projects only
pnpm nx affected --target=test --coverage

# Run coverage for a specific project
pnpm nx test <project-name> --coverage
```

Coverage reports are generated in the `coverage/` directory.
