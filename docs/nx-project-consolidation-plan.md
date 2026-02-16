# Nx Project Consolidation Plan (Cycle-Safe)

## Baseline

- Source: `pnpm nx graph --print`
- Current projects: **54**
- Current dependency edges: **329**
- Current cycles: **none**

## Method

1. Grouped likely merge candidates by bounded domain/folder and naming patterns.
2. Simulated project contraction on the Nx graph.
3. Rejected merge sets that introduce new cycles after contraction.

## Recommended merge backlog (cycle-safe set)

> The following 7 merge tasks can be executed together without introducing cycles, and reduce project count by **8** total.

| Merge task | Projects to merge                                                 | Planned resulting project   | Agent    | Status   | Notes                                                             |
| ---------- | ----------------------------------------------------------------- | --------------------------- | -------- | -------- | ----------------------------------------------------------------- |
| M1         | `ext-assetus-components`, `ext-assetus-core`, `ext-assetus-pages` | `ext-assetus`               | ts-coder | Proposed | Highest reduction in one domain (3 -> 1)                          |
| M2         | `ext-debtus-internal`, `ext-debtus-shared`                        | `ext-debtus`                | ts-coder | Proposed | Straightforward internal split collapse                           |
| M3         | `contactus-core`, `contactus-services`                            | `contactus-core-services`   | ts-coder | Proposed | Keep `contactus-internal` and `contactus-shared` separate for now |
| M4         | `contactus-internal`, `contactus-shared`                          | `contactus-internal-shared` | ts-coder | Proposed | Safe together with M3                                             |
| M5         | `ext-schedulus-main`, `ext-schedulus-shared`                      | `ext-schedulus-main-shared` | ts-coder | Proposed | Do not include `ext-schedulus-core` in this batch                 |
| M6         | `scrumspace-dailyscrum`, `scrumspace-retrospectives`              | `scrumspace-features`       | ts-coder | Proposed | Keep `scrumspace-scrummodels` separate                            |
| M7A        | `auth-core`, `auth-ui`                                            | `auth-core-ui`              | ts-coder | Proposed | **Mutually exclusive** with M7B                                   |

### Alternative to M7A

| Merge task | Projects to merge                | Planned resulting project | Agent    | Status   | Notes                          |
| ---------- | -------------------------------- | ------------------------- | -------- | -------- | ------------------------------ |
| M7B        | `space-models`, `space-services` | `space-models-services`   | ts-coder | Proposed | Choose this **instead of** M7A |

## Important constraint

- **Do not run M7A and M7B together**. Combining both creates a contracted-graph cycle.

## Explicitly not safe as single merges (currently)

These introduced cycles in contraction simulation and should not be done as one-step merges right now:

- `auth-core + auth-models + auth-ui`
- `contactus-core + contactus-internal + contactus-services + contactus-shared`
- `space-components + space-models + space-pages + space-services`
- `scrumspace-dailyscrum + scrumspace-retrospectives + scrumspace-scrummodels`
- `ext-schedulus-core + ext-schedulus-main + ext-schedulus-shared`
- all `ext-*` projects into one mega-project

## Coordination board

| Step | Action                                                            | Agent        | Status           |
| ---- | ----------------------------------------------------------------- | ------------ | ---------------- |
| C1   | Re-run graph export and baseline check                            | planner      | Pending          |
| C2   | Execute M1 + M2                                                   | ts-coder     | Pending          |
| C3   | Execute M3 + M4 + M5 + M6                                         | ts-coder     | Pending          |
| C4   | Pick **one**: M7A or M7B                                          | orchestrator | Pending decision |
| C5   | Update imports, tags, and implicit deps for merged projects       | coder        | Pending          |
| C6   | Validate acyclic graph after each batch (`pnpm nx graph --print`) | task         | Pending          |
| C7   | Run targeted Nx checks (`lint/test/build`) for affected projects  | task         | Pending          |
| C8   | Final workspace verification and cleanup                          | planner      | Pending          |

## Validation commands (after each batch)

```bash
pnpm nx graph --print > /tmp/nx-graph-after.json
# Then run the same cycle check script used in analysis to confirm no cycles.
```
