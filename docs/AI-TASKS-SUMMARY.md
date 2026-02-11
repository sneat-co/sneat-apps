# AI Agent Tasks - Quick Reference

**10 High-ROI Improvements for sneat-apps**

---

## 🎯 Priority Order

### ⚡ TIER 1: Critical (Do First)

| #   | Task                   | Impact     | Effort | Time | Quick Description                                               |
| --- | ---------------------- | ---------- | ------ | ---- | --------------------------------------------------------------- |
| 1   | **Re-enable CI Tests** | 🔥🔥🔥🔥🔥 | 🟢 Low | 2h   | Uncomment tests in `.github/workflows/build-nx.yml`             |
| 2   | **Coverage Baseline**  | 🔥🔥🔥🔥🔥 | 🟢 Low | 3h   | Add Vitest coverage thresholds, badges                          |
| 3   | **Lazy Load Data**     | 🔥🔥🔥🔥   | 🟡 Med | 4h   | Move emojis.ts (1160 lines) & countries.ts (1757 lines) to JSON |

**Total**: 9 hours | **ROI**: ⭐⭐⭐⭐⭐

---

### 🔥 TIER 2: High Priority

| #   | Task                       | Impact   | Effort | Time | Quick Description                                                                              |
| --- | -------------------------- | -------- | ------ | ---- | ---------------------------------------------------------------------------------------------- |
| 4   | **Test Core Services**     | 🔥🔥🔥🔥 | 🟡 Med | 10h  | Add tests for: `sneat-firestore.service.ts`, `space.service.ts`, `sneat-auth-state-service.ts` |
| 5   | **Split Large Components** | 🔥🔥🔥   | 🟡 Med | 8h   | Refactor 3 components (775, 661, 607 lines) into <250 line units                               |
| 6   | **Document Architecture**  | 🔥🔥🔥   | 🟢 Low | 5h   | Create `ARCHITECTURE.md`, `TESTING.md`, Docker Compose setup                                   |

**Total**: 23 hours | **ROI**: ⭐⭐⭐⭐

---

### 💡 TIER 3: Medium Priority

| #   | Task                 | Impact | Effort | Time | Quick Description                                       |
| --- | -------------------- | ------ | ------ | ---- | ------------------------------------------------------- |
| 7   | **Path Aliases**     | 🔥🔥   | 🟢 Low | 3h   | Add TS path aliases to eliminate `../../../../` imports |
| 8   | **Pre-commit Tests** | 🔥🔥   | 🟢 Low | 2h   | Run tests in pre-commit hook                            |
| 9   | **Test Templates**   | 🔥🔥   | 🟡 Med | 5h   | Create reusable test templates for extensions           |
| 10  | **CI Optimization**  | 🔥🔥   | 🟡 Med | 6h   | Reduce CI from 15min → 7min (caching, parallelization)  |

**Total**: 16 hours | **ROI**: ⭐⭐⭐

---

## 📊 At a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    TOTAL: 48 HOURS                          │
│                                                             │
│  Critical Tasks (3):  9 hours  ⚡⚡⚡⚡⚡                      │
│  High Tasks (3):     23 hours  🔥🔥🔥🔥                      │
│  Medium Tasks (4):   16 hours  💡💡💡                        │
│                                                             │
│  Expected Outcome:                                          │
│  ✅ Test coverage: 35% → 75%                                │
│  ✅ CI time: 15min → 7min                                   │
│  ✅ Bundle size: -15%                                       │
│  ✅ Dev setup: 3hrs → 15min                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Week 1 Quick Wins (16 hours)

**Execute in this order:**

1. **Task 1**: Re-enable CI tests (2h) → ⚠️ BLOCKER - Must do first
2. **Task 2**: Coverage baseline (3h) → 📊 Quality gate
3. **Task 3**: Lazy load data (4h) → 🚀 User-facing improvement
4. **Task 8**: Pre-commit hooks (2h) → 🛡️ Prevent regressions
5. **Task 6**: Docker setup (5h) → 🎯 Onboarding improvement

**Result**: 5 tasks complete, immediate quality boost

---

## 📋 Implementation Checklist

Copy this into your task tracker:

```markdown
## Critical (Week 1)

- [ ] Task 1: Re-enable CI tests (.github/workflows/build-nx.yml)
- [ ] Task 2: Add coverage baseline (vitest.workspace.ts)
- [ ] Task 3: Lazy load emojis.ts & countries.ts

## High Priority (Week 2-3)

- [ ] Task 4: Test sneat-firestore.service.ts
- [ ] Task 4: Test space.service.ts
- [ ] Task 4: Test sneat-auth-state-service.ts
- [ ] Task 5: Split sql-query-editor.component.ts
- [ ] Task 5: Split scrum-page.component.ts
- [ ] Task 5: Split list-page.component.ts
- [ ] Task 6: Create ARCHITECTURE.md
- [ ] Task 6: Create docs/TESTING.md
- [ ] Task 6: Create docker-compose.yml

## Medium Priority (Week 4)

- [ ] Task 7: Add TypeScript path aliases
- [ ] Task 8: Update pre-commit hooks
- [ ] Task 9: Create test templates
- [ ] Task 10: Optimize CI/CD caching
- [ ] Task 10: Parallelize test execution
```

---

## 🎯 AI Agent Commands

```bash
# Task 1: Re-enable CI tests
vim .github/workflows/build-nx.yml  # Uncomment lines 56-57

# Task 2: Coverage baseline
pnpm run coverage:analyze
vim vitest.workspace.ts  # Add coverage config

# Task 3: Lazy load data
mv libs/extensions/listus/src/lib/services/emojis.ts apps/sneat-app/src/assets/emojis.json
# Update imports to use HttpClient

# Task 4: Add tests
pnpm nx g @nx/angular:service-test sneat-firestore --project=api

# Task 5: Split components
pnpm nx g @nx/angular:component sql-editor-input --project=datatug-main

# Task 7: Path aliases
vim tsconfig.base.json  # Add "paths" config
npx tsc-alias  # Refactor imports

# Task 10: CI optimization
vim .github/workflows/build-nx.yml  # Add caching
```

---

## 📈 Success Metrics

Track these weekly:

| Metric           | Week 0   | Target | Track                                                  |
| ---------------- | -------- | ------ | ------------------------------------------------------ |
| Test Coverage    | ~35%     | 75%    | `pnpm run coverage:analyze`                            |
| CI Time          | 15 min   | 7 min  | GitHub Actions dashboard                               |
| Bundle Size      | Baseline | -15%   | `pnpm nx build sneat-app --stats-json`                 |
| Files >400 lines | 8        | 0      | `find . -name "*.ts" -exec wc -l {} + \| awk '$1>400'` |
| TODO/FIXME       | 150+     | <50    | `grep -r "TODO\|FIXME" --include="*.ts"`               |

---

## 🔗 Full Details

See [AI-IMPROVEMENT-PLAN.md](AI-IMPROVEMENT-PLAN.md) for:

- Detailed problem statements
- Step-by-step implementation guides
- Code examples
- Architecture explanations
- Supporting evidence

---

**Last Updated**: 2026-02-10
