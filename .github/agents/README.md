# Test Coverage Agents

This directory contains GitHub Copilot agents focused on increasing test coverage for Nx projects in the sneat-apps monorepo.

## Main Agent: test-coverage-improver.agent.md

**Generic test coverage improvement agent** that works on any Nx project in the monorepo.

- **Type:** Generic (works on any project)
- **Capabilities:**
  - Measures and analyzes test coverage
  - Generates detailed coverage reports
  - Creates tests to improve coverage
  - Updates documentation automatically
  - Supports all project types in the workspace

## How to Use the Agent

### Basic Invocation

```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared
Target Coverage: 60%

Please:
1. Measure current coverage
2. Generate COVERAGE-REPORT.md
3. Identify top 5 priority files
4. Create tests to increase coverage by 10%
5. Update documentation
```

### Invocation Parameters

- **project_id** (required): Nx project name (e.g., `ext-schedulus-shared`, `contactus-shared`, `auth-core`)
- **target_coverage** (optional): Target coverage % (default: 60% for libraries, 70% for security-critical)
- **focus_area** (optional): Specific area to focus on (e.g., `services`, `components`, `utilities`)

### Examples for Different Projects

**Schedule Management:**
```
@test-coverage-improver.agent.md
Project ID: ext-schedulus-shared
Focus on schedule calculation services and date utilities.
```

**Contact Management:**
```
@test-coverage-improver.agent.md
Project ID: contactus-shared
Target Coverage: 60%
Focus on contact services and form validation.
```

**Authentication (Security Critical):**
```
@test-coverage-improver.agent.md
Project ID: auth-core
Target Coverage: 70%
Focus on authentication flows and security guards.
Priority: security-critical
```

## What the Agent Does

1. **Discovers** project details and structure
2. **Measures** current test coverage via Nx
3. **Analyzes** coverage gaps and priorities
4. **Generates** `COVERAGE-REPORT.md` in project folder
5. **Implements** tests to improve coverage
6. **Updates** project README and `/docs/test-coverage.md`

## Agent Workflow

The agent follows a systematic workflow:

1. **Analyze:** Run coverage reports to identify gaps
2. **Prioritize:** Focus on high-impact, low-complexity code first
3. **Implement:** Write comprehensive tests using Vitest
4. **Validate:** Run tests to ensure they pass
5. **Report:** Use report_progress to commit changes
6. **Iterate:** Continue until coverage targets are met

## Test Strategy

### Phase 1: Low-Hanging Fruit
- Pure functions and utilities
- Simple models and interfaces
- Data transformations
- Validators and formatters

### Phase 2: Business Logic
- Services with dependencies (mocked)
- Complex algorithms
- State management
- Error handling

### Phase 3: Integration
- Component testing
- Service integration
- End-to-end scenarios

## Coverage Goals

See [/docs/test-coverage.md](/docs/test-coverage.md) for current coverage status across all projects.

| Project Type | Target Coverage |
|--------------|-----------------|
| Security-Critical (auth-*) | 70%+ |
| Core Libraries | 60%+ |
| Feature Extensions | 60%+ |
| UI Components | 50%+ |

## Running Tests

### Individual Project
```bash
# Run tests for specific project
pnpm nx test <project-id>

# Run with coverage
pnpm nx test <project-id> --coverage

# Run in watch mode
pnpm nx test <project-id> --watch
```

### Multiple Projects
```bash
# Run tests for multiple projects
pnpm nx run-many --target=test --projects=<project1>,<project2> --coverage
```

## Best Practices

1. **Meaningful Tests:** Write tests that verify behavior, not just increase coverage numbers
2. **Follow Patterns:** Use existing test patterns in the codebase
3. **Mock Appropriately:** Mock external dependencies (Firebase, HTTP, etc.)
4. **Test Edge Cases:** Don't just test happy paths
5. **Document Complex Tests:** Add comments for non-obvious test scenarios
6. **Incremental Progress:** Commit frequently using report_progress
7. **Run Before Commit:** Always verify tests pass before committing

## Project-Specific Files

For each project worked on, the agent creates:

1. **`<project-root>/COVERAGE-REPORT.md`** - Detailed coverage report with:
   - Current coverage metrics
   - Files categorized by coverage level
   - Top priority targets
   - Recent improvements

2. **`<project-root>/README.md`** - Updated with coverage link

3. **`/docs/test-coverage.md`** - Central documentation updated with project status

## Example Coverage Report Structure

```markdown
# Test Coverage Report: project-name

**Generated:** 2024-02-17
**Coverage:** 45.5%
**Target:** 60%

## Summary
- Total Files: 50
- Test Files: 25
- Statements: 45.5%
- Branches: 42.3%
- Functions: 48.1%
- Lines: 45.5%

## Top Priority Targets
1. core-service.ts - 0% coverage, 200 lines
2. utils.ts - 15% coverage, 150 lines
3. validators.ts - 30% coverage, 100 lines
```

## Integration with CI/CD

- Tests run automatically on every PR
- Coverage reports are generated and cached by Nx Cloud
- Failed tests block PR merges
- Coverage trends tracked over time

## Related Documentation

- [TEST_COVERAGE_PLAN.md](/TEST_COVERAGE_PLAN.md) - Overall coverage strategy
- [docs/test-coverage.md](/docs/test-coverage.md) - Central coverage documentation
- [TESTING-QUICK-REF.md](/TESTING-QUICK-REF.md) - Testing reference guide
- [docs/TESTING.md](/docs/TESTING.md) - Detailed testing documentation

## Migrating from Old Agents

This generic agent replaces the previous specialized agents:
- ~~test-coverage-ext-schedulus-shared.agent.md~~ (removed)
- ~~test-coverage-contactus-shared.agent.md~~ (removed)
- ~~test-coverage-auth-core.agent.md~~ (removed)

The new agent provides the same functionality but works on any project in the workspace.

## Support

For issues or questions about test coverage:
1. Check [/docs/test-coverage.md](/docs/test-coverage.md) for guidance
2. Review existing tests in the project for patterns
3. Consult the testing documentation
4. Use the test-coverage-improver agent
5. Open a GitHub discussion for complex scenarios
