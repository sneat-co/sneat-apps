# Test Coverage Increase Plan

## Overview

This plan outlines the strategy to increase test coverage across all NX projects in the `sneat-apps` workspace, focusing on core projects first and then projects with the highest absolute numbers of uncovered lines.

## Prioritization Strategy

1. **Priority 1: Core Projects.** These are fundamental libraries used across the application.
2. **Priority 2: High Impact Projects.** Projects with the most uncovered lines.
3. **Exclusion:** The `wizard` project is excluded as it is currently being improved.

## Current Analysis (Summary)

| Project                       | Type     | Coverage % | Uncovered Lines | Priority |
| :---------------------------- | :------- | :--------- | :-------------- | :------- |
| `extensions-schedulus-shared` | Core     | 35.05%     | 1416            | 1        |
| `contactus-shared`            | Core     | 36.03%     | 1335            | 2        |
| `auth-core`                   | Core     | 21.82%     | 129             | 3        |
| `core`                        | Core     | 53.38%     | 69              | 4        |
| `datatug-main`                | Non-Core | 30.42%     | 2086            | 5        |

## Top 5 Target Projects

The following projects will be addressed in order:

1. `extensions-schedulus-shared`
2. `contactus-shared`
3. `auth-core`
4. `core`
5. `datatug-main`

_Note: `datatug-main` is included because it has the highest absolute number of uncovered lines (2086), making it a high-impact target once core projects are addressed._

## Implementation Workflow

For each project:

1. **Identify Low-Hanging Fruit:** Focus on utility functions, pure logic, and exported components that are currently untested but easy to mock.
2. **Test Generation:**
   - Create a `.spec.ts` file if missing.
   - Use `vitest` as the testing framework.
   - Limit attempts to 2 per code block; move on if failing to resolve complex dependencies.
3. **Validation:** Run `nx test <project-name> --coverage` to verify the increase.

## Success Criteria

- Measurable increase in coverage percentage for each target project.
- Improved stability of core libraries.
