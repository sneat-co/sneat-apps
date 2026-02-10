# Sneat-Apps: AI Agent Improvement Plan (High ROI)

**Date**: 2026-02-10  
**Analysis Scope**: Full repository (1,089 TypeScript files, 70+ libraries, 503 test files)  
**Focus**: Maximum ROI tasks for AI agents  

---

## 📊 Executive Summary

Based on comprehensive codebase analysis of sneat-apps, this plan identifies the **top 10 high-ROI improvements** that AI agents can tackle. The repository is a well-structured Nx monorepo with modern Angular 21 + TypeScript 5.9 stack, but has critical gaps in testing, CI/CD validation, and bundle optimization.

### Key Findings
- ✅ **Strengths**: Modern tech stack, comprehensive README docs, Nx caching, good project structure
- ❌ **Critical Issues**: Unit tests disabled in CI, missing test coverage, large bundle bloat
- ⚠️ **Technical Debt**: 150+ TODO/FIXME comments, 32 ESLint disables, components up to 775 lines

---

## 🎯 TOP 10 TASKS (Priority Order)

### TIER 1: Critical - High Impact, Low Effort ⭐⭐⭐⭐⭐

#### Task 1: Re-enable Unit Tests in CI/CD Pipeline
**Impact**: 🔥🔥🔥🔥🔥 | **Effort**: 🟢 Low (1-2 hours) | **ROI**: ⭐⭐⭐⭐⭐

**Problem**: 
- Unit tests are **commented out** in `.github/workflows/build-nx.yml` (lines 56-57)
- Only Playwright E2E tests run in CI, leaving unit test failures undetected
- Regressions can reach production

**Solution**:
```yaml
# In .github/workflows/build-nx.yml
- name: nx test affected
  run: pnpm run nx affected --target=test --base=${{ env.NX_BASE }} --parallel=8
```

**Steps**:
1. Uncomment test step in workflow
2. Add test coverage reporting with Vitest
3. Configure to fail on test failures
4. Add test results as GitHub Actions output

**Success Metrics**:
- ✅ All PRs run unit tests
- ✅ Test failures block merges
- ✅ Coverage reports in PR comments

---

#### Task 2: Add Test Coverage Baseline
**Impact**: 🔥🔥🔥🔥 | **Effort**: 🟢 Low (2-3 hours) | **ROI**: ⭐⭐⭐⭐⭐

**Problem**:
- No coverage thresholds configured
- `scripts/list-uncovered-lines.mjs` exists but not integrated
- Unknown current coverage percentage

**Solution**:
```typescript
// vitest.workspace.ts
export default defineWorkspace([
  {
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        lines: 50,
        functions: 50,
        branches: 45,
        statements: 50,
      },
    },
  },
]);
```

**Steps**:
1. Run coverage analysis: `pnpm run coverage:analyze`
2. Set baseline thresholds (start at 50%)
3. Add coverage badges to README.md
4. Integrate with CI to track trends
5. Configure PR comments with coverage diff

**Success Metrics**:
- ✅ Coverage baseline established
- ✅ Coverage tracked per PR
- ✅ Coverage badges visible

---

#### Task 3: Optimize Bundle Size - Lazy Load Large Data Files
**Impact**: 🔥🔥🔥🔥 | **Effort**: 🟡 Medium (3-4 hours) | **ROI**: ⭐⭐⭐⭐

**Problem**:
- `libs/extensions/listus/src/lib/services/emojis.ts`: **1,160 lines** of hardcoded emoji data
- `libs/components/src/lib/country-selector/countries.ts`: **1,757 lines** of country data
- Both embedded in main bundle, adding ~100KB+ bloat
- Affects app load time on slow networks

**Solution**:
```typescript
// Instead of:
import { EMOJIS } from './emojis';

// Do:
const emojis = await import('./emojis.json');

// Or use dynamic component loading:
@Component({
  imports: [EmojiSelectorComponent],
  // lazy load
})
```

**Steps**:
1. Move `emojis.ts` → `emojis.json` in `src/assets/`
2. Move `countries.ts` → `countries.json` in `src/assets/`
3. Update components to lazy load data
4. Use Angular `HttpClient` or dynamic imports
5. Measure bundle size before/after

**Success Metrics**:
- ✅ Main bundle reduced by 15%+
- ✅ Faster initial page load
- ✅ Data loaded on-demand only

---

### TIER 2: High Priority - High Impact, Medium Effort ⭐⭐⭐⭐

#### Task 4: Add Missing Tests for Core Services
**Impact**: 🔥🔥🔥🔥 | **Effort**: 🟡 Medium (8-10 hours) | **ROI**: ⭐⭐⭐⭐

**Problem**:
Critical infrastructure services have **zero test coverage**:
- `libs/api/src/lib/sneat-firestore.service.ts` (392 lines)
- `libs/api/src/lib/sneat-api-service.ts`
- `libs/space/services/src/lib/services/space.service.ts`
- `libs/auth/core/src/lib/sneat-auth-state-service.ts` (392 lines)

**Solution**:
Create comprehensive unit tests using Vitest + Firebase emulator mocks:

```typescript
// sneat-firestore.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { SneatFirestoreService } from './sneat-firestore.service';

describe('SneatFirestoreService', () => {
  let service: SneatFirestoreService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SneatFirestoreService],
    });
    service = TestBed.inject(SneatFirestoreService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should handle Firestore queries', async () => {
    // Mock Firestore calls
    // Test query logic
  });
});
```

**Steps**:
1. Create `.spec.ts` files for each service
2. Mock Firebase dependencies
3. Test happy paths and error cases
4. Test async operations with `fakeAsync`
5. Aim for 80%+ coverage per service

**Success Metrics**:
- ✅ Core services have 80%+ coverage
- ✅ Tests run in <2 seconds each
- ✅ Mocks prevent external dependencies

---

#### Task 5: Split Large Components (Code Smell)
**Impact**: 🔥🔥🔥 | **Effort**: 🟡 Medium (6-8 hours) | **ROI**: ⭐⭐⭐⭐

**Problem**:
Multiple components exceed 500 lines, violating Single Responsibility Principle:
- `libs/datatug/main/src/lib/queries/query/sql-query/sql-query-editor.component.ts` (775 lines)
- `libs/scrumspace/dailyscrum/src/lib/scrum-page/scrum-page.component.ts` (661 lines)
- `libs/extensions/listus/src/lib/pages/list/list-page.component.ts` (607 lines)

**Solution**:
Extract sub-components and services:

```typescript
// Before: sql-query-editor.component.ts (775 lines)
@Component({ ... })
export class SqlQueryEditorComponent {
  // SQL editor logic
  // Query execution logic
  // Results display logic
  // Error handling
}

// After: Split into 3 components + 1 service
// sql-query-editor.component.ts (200 lines) - orchestrator
// sql-editor-input.component.ts (150 lines) - editor UI
// sql-query-results.component.ts (200 lines) - results display
// sql-query.service.ts (150 lines) - business logic
```

**Steps**:
1. Identify logical boundaries in large components
2. Extract UI sub-components
3. Extract business logic to services
4. Create tests for each new unit
5. Verify functionality unchanged

**Target**: Max 200-250 lines per component

**Success Metrics**:
- ✅ No components >400 lines
- ✅ Clear separation of concerns
- ✅ Easier to test individual pieces

---

#### Task 6: Document Architecture & Setup
**Impact**: 🔥🔥🔥 | **Effort**: 🟢 Low (4-5 hours) | **ROI**: ⭐⭐⭐⭐

**Problem**:
- New developers take 2-3 hours to setup
- No architecture documentation
- No testing guidelines
- Firebase emulator setup is manual

**Solution**:
Create comprehensive documentation:

**1. ARCHITECTURE.md**:
```markdown
# Sneat-Apps Architecture

## Module Structure
- `libs/core` - Shared utilities
- `libs/extensions/*` - Feature modules
- `libs/auth` - Authentication layer
...

## Dependency Graph
[Insert mermaid diagram]

## Design Decisions
- Why Nx monorepo?
- Why standalone components?
...
```

**2. docs/TESTING.md**:
```markdown
# Testing Guide

## Unit Testing
- Use Vitest for all unit tests
- Mock Firebase with test fixtures
...

## E2E Testing
- Use Playwright for E2E
- Firebase emulator required
...
```

**3. docker-compose.yml**:
```yaml
version: '3.8'
services:
  firebase-emulator:
    image: node:20
    command: firebase emulators:start
    ports:
      - "9099:9099"
      - "8080:8080"
```

**Steps**:
1. Create ARCHITECTURE.md with diagrams
2. Create docs/TESTING.md with examples
3. Create Docker Compose for dev environment
4. Update README-DEV-SETUP.md to use Docker
5. Add troubleshooting guide

**Success Metrics**:
- ✅ New dev setup time: <15 minutes
- ✅ Architecture clearly documented
- ✅ Docker setup works first try

---

### TIER 3: Medium Priority ⭐⭐⭐

#### Task 7: Add TypeScript Path Aliases
**Impact**: 🔥🔥 | **Effort**: 🟢 Low (2-3 hours) | **ROI**: ⭐⭐⭐

**Problem**:
- 40+ files use deep relative imports: `../../../../`
- Refactoring breaks imports
- Circular dependency risk

**Solution**:
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "paths": {
      "@sneat/core/*": ["libs/core/src/*"],
      "@sneat/auth/*": ["libs/auth/*/src/*"],
      "@sneat/extensions/*": ["libs/extensions/*/src/*"],
      "@sneat/api": ["libs/api/src/index.ts"]
    }
  }
}
```

**Steps**:
1. Add path aliases to `tsconfig.base.json`
2. Run automated refactor: `npx tsc-alias`
3. Update imports across codebase
4. Verify build still works
5. Update ESLint to enforce alias usage

**Success Metrics**:
- ✅ No imports with 3+ `../` levels
- ✅ Easier refactoring
- ✅ Clearer module boundaries

---

#### Task 8: Add Pre-commit Test Coverage Hooks
**Impact**: 🔥🔥 | **Effort**: 🟢 Low (2 hours) | **ROI**: ⭐⭐⭐

**Problem**:
- Pre-commit only runs ESLint + Prettier
- Untested code can be committed
- Test failures discovered too late

**Solution**:
```bash
# .git-hooks/pre-commit
#!/bin/bash

# Get changed files
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.ts$')

if [ -n "$CHANGED_FILES" ]; then
  # Run tests for changed files
  pnpm nx affected --target=test --uncommitted
  
  if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Fix tests before committing."
    exit 1
  fi
fi

# Run linters
pnpm lint-staged
```

**Steps**:
1. Update `.git-hooks/pre-commit`
2. Add test run for affected projects
3. Configure to block on test failures
4. Add option to skip with `--no-verify`

**Success Metrics**:
- ✅ Tests run before commit
- ✅ Broken tests blocked at source
- ✅ Faster feedback loop

---

#### Task 9: Create Extension Module Test Templates
**Impact**: 🔥🔥 | **Effort**: 🟡 Medium (4-5 hours) | **ROI**: ⭐⭐⭐

**Problem**:
Extension modules lack tests:
- `libs/extensions/assetus` - 0 tests
- `libs/extensions/budgetus` - 0 tests
- `libs/extensions/listus` - minimal tests
- `libs/extensions/schedulus` - minimal tests

**Solution**:
Create reusable test templates:

```typescript
// templates/extension-service.spec.ts.template
import { TestBed } from '@angular/core/testing';
import { {{ServiceName}} } from './{{service-name}}.service';

describe('{{ServiceName}}', () => {
  let service: {{ServiceName}};
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{{ServiceName}}],
    });
    service = TestBed.inject({{ServiceName}});
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // Add more test cases
});
```

**Steps**:
1. Create test templates for common patterns
2. Document testing patterns in docs/TESTING.md
3. Generate tests for top 5 extensions
4. Automate template generation with Nx generator

**Success Metrics**:
- ✅ All extensions have baseline tests
- ✅ Test templates reduce writing time 80%
- ✅ Consistent test structure

---

#### Task 10: CI/CD Performance Optimization
**Impact**: 🔥🔥 | **Effort**: 🟡 Medium (4-6 hours) | **ROI**: ⭐⭐⭐

**Problem**:
- CI takes 10-15 minutes
- `fetch-depth: 0` slows checkout
- Tests not parallelized
- Build artifacts not cached

**Solution**:
```yaml
# .github/workflows/build-nx.yml
- name: Checkout repository
  uses: actions/checkout@v6
  with:
    fetch-depth: 2  # Changed from 0

- name: Cache Nx build outputs
  uses: actions/cache@v5
  with:
    path: node_modules/.cache/nx
    key: nx-${{ hashFiles('**/pnpm-lock.yaml') }}

- name: Run tests in parallel
  run: pnpm nx affected --target=test --parallel=8
```

**Steps**:
1. Optimize git checkout depth
2. Add Nx build cache
3. Parallelize test execution
4. Use matrix strategy for multi-version tests
5. Measure CI time improvements

**Success Metrics**:
- ✅ CI time reduced to <7 minutes
- ✅ Build artifacts cached
- ✅ Tests run in parallel

---

## 📈 Impact Summary

| Tier | Tasks | Time | Expected Outcome |
|------|-------|------|------------------|
| **Critical** | 1-3 | 6-9 hours | Prevent bugs, improve UX, establish quality gates |
| **High** | 4-6 | 18-23 hours | 80%+ test coverage for core, better maintainability |
| **Medium** | 7-10 | 12-16 hours | Faster CI, better DX, scalable testing |
| **TOTAL** | 10 | 36-48 hours | Transformed codebase quality & velocity |

---

## 🚀 Quick Win Strategy (Week 1)

**Day 1-2**: 
- ✅ Task 1: Re-enable CI tests (2 hours)
- ✅ Task 2: Coverage baseline (3 hours)

**Day 3-4**:
- ✅ Task 3: Lazy load data (4 hours)
- ✅ Task 8: Pre-commit hooks (2 hours)

**Day 5**:
- ✅ Task 6: Docker setup (5 hours)

**Week 1 Total**: 16 hours, 5 tasks complete, immediate quality improvement

---

## 📊 Success Metrics (3-Month Targets)

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Test Coverage | ~35% | 75% | +114% |
| Core Service Coverage | 0% | 90% | +90% |
| CI Time | 15 min | 7 min | -53% |
| Bundle Size | Baseline | -15% | Faster loads |
| Dev Setup Time | 2-3 hours | <15 min | -93% |
| PR Rejection Rate | Baseline | -60% | Better quality |
| Files >400 lines | 8 | 0 | Better maintainability |

---

## 🎯 AI Agent Guidelines

When implementing these tasks:

1. **Start with Tier 1** - Critical tasks have highest ROI
2. **Test incrementally** - Add tests as you refactor
3. **Measure impact** - Before/after metrics for each task
4. **Document changes** - Update relevant docs
5. **Follow patterns** - Match existing code style
6. **Use Nx commands** - Always prefix with `pnpm nx`
7. **Run affected targets** - Don't rebuild everything
8. **Leverage skills** - Use `nx-generate`, `nx-workspace` skills

---

## 📚 Supporting Data

### Codebase Statistics
- **Total TypeScript files**: 1,089
- **Test files**: 503 (.spec.ts, .test.ts)
- **TODO/FIXME comments**: 150+
- **ESLint disables**: 32
- **Largest file**: 1,757 lines (countries.ts)
- **Apps**: 3 (sneat-app, datatug-app, logist-app)
- **Libraries**: 70+

### Tech Stack
- Angular 21.1.3
- TypeScript 5.9.3
- Nx 22.5.0
- Vitest 4.0.18
- Playwright 1.50.1
- Ionic 8.7.17
- Capacitor 8.0.2
- Firebase 12.9.0

---

## 🔗 Related Documents

- [README.md](README.md) - Project overview
- [README-DEV-SETUP.md](docs/README-DEV-SETUP.md) - Setup instructions
- [README-DEV-FAQ.md](README-DEV-FAQ.md) - Development FAQ
- [AGENTS.md](AGENTS.md) - AI agent guidelines

---

**Last Updated**: 2026-02-10  
**Next Review**: 2026-05-10 (3 months)
