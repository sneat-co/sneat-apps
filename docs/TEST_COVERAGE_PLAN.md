# Test Coverage Increase Plan

## Overview

This plan outlines the strategy to increase test coverage across all NX projects in the `sneat-apps` workspace, focusing on core projects first and then projects with the highest absolute numbers of uncovered lines.

## Prioritization Strategy

1. **Priority 1: Core Projects.** These are fundamental libraries used across the application.
2. **Priority 2: High Impact Projects.** Projects with the most uncovered lines.

## Current Analysis

See [test-coverage.md](test-coverage.md).

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
