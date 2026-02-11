# About git hooks

To setup git hooks run:

> git config core.hooksPath .git-hooks || echo 'Not in a git repo'

There is 2 hooks setup:

- [pre-commit](pre-commit)
  - Checks for circular dependencies (using `madge`)
  - Runs tests for affected projects (when TypeScript files are changed)
  - Runs linting and formatting (using `lint-staged`)
  - Can be skipped with `git commit --no-verify` if needed
- [pre-push](pre-push)
  - Checks branch name, should have valid prefix: `feature|fix|perf|chore|refactor|renovate|personal`
  - runs `lint` for all projects
