# About git hooks

To setup git hooks run:

> git config core.hooksPath .git-hooks || echo 'Not in a git repo'

There is 2 hooks setup:

- [pre-commit](pre-commit)
  - Checks for circular dependencies (using `madge`)
- [pre-push](pre-push)
  - Checks branch name, should have valid prefix: `feature|fix|perf|chore|refactor|renovate|personal`
  - runs `lint` for all projects
