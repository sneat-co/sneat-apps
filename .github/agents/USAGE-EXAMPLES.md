# Test Coverage Agent Usage Examples

This document provides practical examples of how to use the test-coverage-improver agent.

## Quick Start

### Example 1: Basic Coverage Improvement

```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared

Please:
1. Measure current coverage
2. Generate COVERAGE-REPORT.md
3. Identify the top 10 files with lowest coverage
4. Create comprehensive tests for the 5 highest priority files
5. Run tests to validate
6. Update documentation
```

### Example 2: Focus on Specific Area

```
@test-coverage-improver.agent.md

Project ID: contactus-shared
Focus Area: services
Target Coverage: 65%

Please focus on the contact services module:
- Analyze files in libs/contactus/shared/src/lib/services/
- Identify untested methods
- Create comprehensive test suite for ContactService
- Include edge cases and error handling
- Run tests and report coverage delta
```

### Example 3: Security-Critical Testing

```
@test-coverage-improver.agent.md

Project ID: auth-core
Target Coverage: 70%

This is security-critical. Please:
1. Analyze authentication guards and services
2. Create tests for all authentication flows:
   - Login success/failure
   - Token refresh
   - Session timeout
   - Unauthorized access
3. Test authorization rules
4. Ensure all security constraints are validated
5. Run full test suite and report results
```

## Iterative Testing Sessions

### Initial Session
```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared
Focus Area: utilities

Start with low-hanging fruit:
- Test all utility functions in libs/extensions/schedulus/shared/src/lib/utils/
- Generate COVERAGE-REPORT.md with baseline
- Report current coverage percentage
```

### Follow-up Session
```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared

Continue from previous session:
- Review COVERAGE-REPORT.md
- Focus on schedule calculation logic
- Target files: schedule-calculator.service.ts and date-utils.ts
- Aim to reach 50% coverage
- Update COVERAGE-REPORT.md with improvements
```

## Batch Testing Across Projects

### Test Multiple Priority Projects
```
I need to improve test coverage across multiple core projects.

For each project (ext-schedulus-shared, contactus-shared, auth-core):

@test-coverage-improver.agent.md
Project ID: <project-name>

1. Measure current coverage
2. Generate COVERAGE-REPORT.md
3. Create tests for top 5 priority files
4. Validate tests pass
5. Update documentation

Start with auth-core (security-critical), then contactus-shared, then ext-schedulus-shared.
```

## Targeted Testing Scenarios

### Testing Pure Functions
```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared
Focus Area: utilities

Focus on pure functions only:
- Find all pure functions without tests
- Create comprehensive test cases with multiple scenarios
- Include edge cases (null, undefined, empty arrays, etc.)
- Validate all tests pass
- Report coverage improvement
```

### Testing Components
```
@test-coverage-improver.agent.md

Project ID: contactus-shared
Focus Area: components

Focus on component testing:
- Identify untested components
- Use Angular TestBed for component tests
- Test component lifecycle hooks
- Test @Input() and @Output() bindings
- Test user interactions
- Generate component-specific coverage report
```

### Testing Services with Dependencies
```
@test-coverage-improver.agent.md

Project ID: auth-core
Focus Area: services

Focus on service testing with mocks:
- Test AuthService with mocked Firebase
- Test UserService with mocked HTTP client
- Use vitest.mock() for dependencies
- Test async operations
- Validate error handling
- Update COVERAGE-REPORT.md
```

## Coverage Goal Sessions

### Reaching Specific Coverage Target
```
@test-coverage-improver.agent.md

Project ID: contactus-shared
Target Coverage: 60%

Current coverage: 36.03%
Target coverage: 60%
Gap: 23.97 percentage points

Please work systematically to close this gap:
1. Generate COVERAGE-REPORT.md with current state
2. Start with highest-impact files (most uncovered lines)
3. Create comprehensive tests
4. Report progress after each batch of 5 files
5. Continue until we reach 60% coverage
6. Update all documentation
```

## Advanced Usage

### Coverage Analysis and Planning
```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared

Please perform a coverage analysis:
1. Run coverage report
2. Generate COVERAGE-REPORT.md with:
   - Current metrics
   - Files categorized by coverage level
   - Prioritized list of files to test
3. Categorize by difficulty:
   - Easy: Pure functions, utilities (aim for 90%+ coverage)
   - Medium: Services with few dependencies (aim for 70%+ coverage)
   - Hard: Components, complex services (aim for 50%+ coverage)
4. Create a testing plan with estimated effort
5. DO NOT write tests yet - just analyze and plan
```

### Test Review and Improvement
```
@test-coverage-improver.agent.md

Project ID: contactus-shared

Review existing tests and improve them:
1. Analyze current COVERAGE-REPORT.md
2. Find test files with low assertion counts
3. Identify missing edge cases
4. Add missing test scenarios
5. Add missing error case tests
6. Refactor complex tests for better readability
7. Update COVERAGE-REPORT.md with improvements
```

## Working with Different Project Types

### Core Library
```
@test-coverage-improver.agent.md

Project ID: core
Target Coverage: 60%

This is a core library used across the application:
- Focus on API surface and public methods
- Test edge cases thoroughly
- Document complex scenarios
- Ensure backward compatibility through tests
```

### Feature Extension
```
@test-coverage-improver.agent.md

Project ID: datatug-main
Target Coverage: 60%

This is a feature extension with domain-specific logic:
- Focus on user-facing functionality
- Test business rules and validation
- Test data transformations
- Include integration scenarios
```

### UI Components
```
@test-coverage-improver.agent.md

Project ID: components
Target Coverage: 50%
Focus Area: components

Angular component testing:
- Use TestBed for component tests
- Test component lifecycle
- Test @Input() and @Output()
- Test user interactions
- Test template rendering
```

## Comprehensive Testing Session

### Full Coverage Improvement Workflow
```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared
Target Coverage: 60%

Let's do a comprehensive testing session:

Phase 1: Analysis (5 minutes)
- Run coverage report
- Generate COVERAGE-REPORT.md
- Identify priorities

Phase 2: Pure Logic (30 minutes)
- Test all utility functions
- Test data transformers
- Target: All pure functions at 90%+ coverage

Phase 3: Services (45 minutes)
- Test schedule service methods
- Mock external dependencies
- Target: Core services at 70%+ coverage

Phase 4: Components (30 minutes)
- Test critical UI components
- Use TestBed properly
- Target: Public components at 50%+ coverage

Phase 5: Documentation (10 minutes)
- Update COVERAGE-REPORT.md with final metrics
- Update project README.md
- Update /docs/test-coverage.md

Report progress after each phase and provide final summary.
```

## Monitoring Progress

### Check Coverage Dashboard
```
After running the test-coverage-improver agent, check coverage locally:

pnpm nx test <project-id> --coverage

Or check coverage for multiple projects:
pnpm nx run-many --target=test --projects=<project1>,<project2> --coverage
```

### Generate Coverage Report
```
# View coverage report in browser
open coverage/<project-path>/index.html

# Or check the generated COVERAGE-REPORT.md in project folder
cat libs/<project-path>/COVERAGE-REPORT.md
```

## Tips for Success

1. **Be Specific**: Tell the agent exactly what you want to test
2. **Set Clear Goals**: Define coverage targets upfront
3. **Iterate**: Work in small batches, validate frequently
4. **Review Tests**: Ensure tests are meaningful, not just coverage boosters
5. **Use Project Context**: Mention if project is security-critical or has special requirements
6. **Follow Up**: Check generated COVERAGE-REPORT.md and build on it
7. **Document Progress**: Agent will update docs, but review for accuracy

## Troubleshooting

### Tests Failing
```
@test-coverage-improver.agent.md

Project ID: auth-core

The tests you created are failing. Please:
1. Review the test failures
2. Fix the tests (not the production code)
3. Ensure mocks are set up correctly
4. Re-run tests to validate
5. Update COVERAGE-REPORT.md if successful
```

### Low Coverage Increase
```
@test-coverage-improver.agent.md

Project ID: contactus-shared

We only increased coverage by 2% in the last session.
Please analyze why and adjust strategy:
1. Review COVERAGE-REPORT.md
2. Are we testing the right files?
3. Are we testing all branches?
4. Are there untested edge cases?
5. Should we focus on different files?
6. Create new testing plan based on analysis
```

### Missing Coverage Report
```
@test-coverage-improver.agent.md

Project ID: ext-schedulus-shared

The COVERAGE-REPORT.md file is missing or outdated.
Please:
1. Run fresh coverage analysis
2. Generate comprehensive COVERAGE-REPORT.md
3. Ensure it's saved in libs/extensions/schedulus/shared/
4. Update project README.md with link to report
5. Update /docs/test-coverage.md with project status
```

## Integration with Documentation

The agent automatically updates:
- **Project COVERAGE-REPORT.md**: Detailed coverage metrics and priorities
- **Project README.md**: Link to coverage report
- **/docs/test-coverage.md**: Central coverage documentation

Always verify these files are updated after each session.
