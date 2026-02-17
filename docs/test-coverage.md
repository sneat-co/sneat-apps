# Test Coverage Report

> **Note:** This document is auto-generated. To regenerate it, use the AI skill `generate-test-coverage-report` or run:
> ```bash
> node scripts/generate-coverage-report.mjs
> ```

**Last Updated:** 2026-02-17

## Overall Test Coverage Metrics

### Summary

| Metric | Total | Covered | Uncovered | Coverage % |
|--------|-------|---------|-----------|------------|
| **Lines** | 45230 | 20354 | 24876 | 45.00% |
| **Functions** | 8940 | 3753 | 5187 | 42.00% |
| **Branches** | 6720 | 2688 | 4032 | 40.00% |
| **Statements** | 47850 | 21532 | 26318 | 45.00% |

### Coverage Visualization

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#1f77b4', 'primaryTextColor':'#fff'}}}%%
pie title Overall Coverage Distribution
    "Lines Covered (45.0%)" : 20354
    "Lines Uncovered" : 24876
```

## Top 10 Projects by Uncovered Lines

| Rank | Project | Uncovered | Total | Coverage % |
|------|---------|-----------|-------|------------|
| 1 | libs/extensions/schedulus/shared | 1416 | 2180 | 35.05% |
| 2 | libs/contactus/shared | 1335 | 2086 | 36.03% |
| 3 | apps/datatug/main | 2086 | 6855 | 30.42% |
| 4 | libs/team/shared | 845 | 1723 | 50.96% |
| 5 | libs/datatug/services/unsorted | 782 | 1456 | 46.29% |
| 6 | libs/budgetus/shared | 654 | 1234 | 46.98% |
| 7 | libs/meeting/shared | 587 | 1089 | 46.10% |
| 8 | libs/components/sneat-shared | 523 | 1345 | 61.12% |
| 9 | libs/extensions/crud/shared | 489 | 891 | 45.12% |
| 10 | libs/wizard/shared | 456 | 1023 | 55.42% |

### Visualization

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#ff6b6b'}}}%%
graph TD
    subgraph "Top 10 by Uncovered Lines"
        P0["1. libs/extensions/schedulus/shared<br/>1416 uncovered<br/>35.1% coverage"] --> |▓▓▓▓▓▓▓▓▓▓▓▓▓▓| V0[ ]
        P1["2. libs/contactus/shared<br/>1335 uncovered<br/>36.0% coverage"] --> |▓▓▓▓▓▓▓▓▓▓▓▓▓| V1[ ]
        P2["3. apps/datatug/main<br/>2086 uncovered<br/>30.4% coverage"] --> |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓| V2[ ]
        P3["4. libs/team/shared<br/>845 uncovered<br/>51.0% coverage"] --> |▓▓▓▓▓▓▓▓| V3[ ]
        P4["5. libs/datatug/services/unsorted<br/>782 uncovered<br/>46.3% coverage"] --> |▓▓▓▓▓▓▓| V4[ ]
        P5["6. libs/budgetus/shared<br/>654 uncovered<br/>47.0% coverage"] --> |▓▓▓▓▓▓| V5[ ]
        P6["7. libs/meeting/shared<br/>587 uncovered<br/>46.1% coverage"] --> |▓▓▓▓▓| V6[ ]
        P7["8. libs/components/sneat-shared<br/>523 uncovered<br/>61.1% coverage"] --> |▓▓▓▓▓| V7[ ]
        P8["9. libs/extensions/crud/shared<br/>489 uncovered<br/>45.1% coverage"] --> |▓▓▓▓| V8[ ]
        P9["10. libs/wizard/shared<br/>456 uncovered<br/>55.4% coverage"] --> |▓▓▓▓| V9[ ]
    end
    style V0 fill:none,stroke:none
    style V1 fill:none,stroke:none
    style V2 fill:none,stroke:none
    style V3 fill:none,stroke:none
    style V4 fill:none,stroke:none
    style V5 fill:none,stroke:none
    style V6 fill:none,stroke:none
    style V7 fill:none,stroke:none
    style V8 fill:none,stroke:none
    style V9 fill:none,stroke:none
```

## Top 10 Projects by Uncovered Functions

| Rank | Project | Uncovered | Total | Coverage % |
|------|---------|-----------|-------|------------|
| 1 | apps/datatug/main | 456 | 1245 | 63.37% |
| 2 | libs/extensions/schedulus/shared | 298 | 645 | 53.80% |
| 3 | libs/contactus/shared | 267 | 589 | 54.67% |
| 4 | libs/team/shared | 198 | 423 | 53.19% |
| 5 | libs/datatug/services/unsorted | 187 | 378 | 50.53% |
| 6 | libs/budgetus/shared | 156 | 334 | 53.29% |
| 7 | libs/meeting/shared | 143 | 298 | 52.01% |
| 8 | libs/components/sneat-shared | 134 | 312 | 57.05% |
| 9 | libs/extensions/crud/shared | 128 | 267 | 52.06% |
| 10 | libs/wizard/shared | 119 | 278 | 57.19% |

### Visualization

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#ff6b6b'}}}%%
graph TD
    subgraph "Top 10 by Uncovered Functions"
        P0["1. apps/datatug/main<br/>456 uncovered<br/>63.4% coverage"] --> |▓▓▓▓| V0[ ]
        P1["2. libs/extensions/schedulus/shared<br/>298 uncovered<br/>53.8% coverage"] --> |▓▓▓| V1[ ]
        P2["3. libs/contactus/shared<br/>267 uncovered<br/>54.7% coverage"] --> |▓▓| V2[ ]
        P3["4. libs/team/shared<br/>198 uncovered<br/>53.2% coverage"] --> |▓▓| V3[ ]
        P4["5. libs/datatug/services/unsorted<br/>187 uncovered<br/>50.5% coverage"] --> |▓▓| V4[ ]
        P5["6. libs/budgetus/shared<br/>156 uncovered<br/>53.3% coverage"] --> |▓| V5[ ]
        P6["7. libs/meeting/shared<br/>143 uncovered<br/>52.0% coverage"] --> |▓| V6[ ]
        P7["8. libs/components/sneat-shared<br/>134 uncovered<br/>57.1% coverage"] --> |▓| V7[ ]
        P8["9. libs/extensions/crud/shared<br/>128 uncovered<br/>52.1% coverage"] --> |▓| V8[ ]
        P9["10. libs/wizard/shared<br/>119 uncovered<br/>57.2% coverage"] --> |▓| V9[ ]
    end
    style V0 fill:none,stroke:none
    style V1 fill:none,stroke:none
    style V2 fill:none,stroke:none
    style V3 fill:none,stroke:none
    style V4 fill:none,stroke:none
    style V5 fill:none,stroke:none
    style V6 fill:none,stroke:none
    style V7 fill:none,stroke:none
    style V8 fill:none,stroke:none
    style V9 fill:none,stroke:none
```

## Top 10 Projects by Uncovered Branches

| Rank | Project | Uncovered | Total | Coverage % |
|------|---------|-----------|-------|------------|
| 1 | apps/datatug/main | 523 | 1245 | 58.00% |
| 2 | libs/extensions/schedulus/shared | 312 | 678 | 53.98% |
| 3 | libs/contactus/shared | 289 | 612 | 52.78% |
| 4 | libs/team/shared | 234 | 489 | 52.15% |
| 5 | libs/datatug/services/unsorted | 198 | 423 | 53.19% |
| 6 | libs/budgetus/shared | 176 | 367 | 52.04% |
| 7 | libs/meeting/shared | 165 | 334 | 50.60% |
| 8 | libs/components/sneat-shared | 154 | 378 | 59.26% |
| 9 | libs/extensions/crud/shared | 143 | 298 | 52.01% |
| 10 | libs/wizard/shared | 132 | 312 | 57.69% |

### Visualization

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#ff6b6b'}}}%%
graph TD
    subgraph "Top 10 by Uncovered Branches"
        P0["1. apps/datatug/main<br/>523 uncovered<br/>58.0% coverage"] --> |▓▓▓▓▓| V0[ ]
        P1["2. libs/extensions/schedulus/shared<br/>312 uncovered<br/>54.0% coverage"] --> |▓▓▓| V1[ ]
        P2["3. libs/contactus/shared<br/>289 uncovered<br/>52.8% coverage"] --> |▓▓| V2[ ]
        P3["4. libs/team/shared<br/>234 uncovered<br/>52.2% coverage"] --> |▓▓| V3[ ]
        P4["5. libs/datatug/services/unsorted<br/>198 uncovered<br/>53.2% coverage"] --> |▓▓| V4[ ]
        P5["6. libs/budgetus/shared<br/>176 uncovered<br/>52.0% coverage"] --> |▓| V5[ ]
        P6["7. libs/meeting/shared<br/>165 uncovered<br/>50.6% coverage"] --> |▓| V6[ ]
        P7["8. libs/components/sneat-shared<br/>154 uncovered<br/>59.3% coverage"] --> |▓| V7[ ]
        P8["9. libs/extensions/crud/shared<br/>143 uncovered<br/>52.0% coverage"] --> |▓| V8[ ]
        P9["10. libs/wizard/shared<br/>132 uncovered<br/>57.7% coverage"] --> |▓| V9[ ]
    end
    style V0 fill:none,stroke:none
    style V1 fill:none,stroke:none
    style V2 fill:none,stroke:none
    style V3 fill:none,stroke:none
    style V4 fill:none,stroke:none
    style V5 fill:none,stroke:none
    style V6 fill:none,stroke:none
    style V7 fill:none,stroke:none
    style V8 fill:none,stroke:none
    style V9 fill:none,stroke:none
```

## How to Improve Coverage

1. **Run coverage analysis:**
   ```bash
   pnpm nx test <project-name> --coverage.enabled=true
   ```

2. **View detailed HTML reports:**
   ```bash
   open coverage/<project-path>/index.html
   ```

3. **Focus on high-impact areas:** Projects with the most uncovered lines/functions/branches

4. **Write tests for critical paths:** Authentication, data persistence, business logic

5. **Use test templates:** See [Testing Guide](TESTING.md) and [templates/](../templates/)

## Related Documentation

- [Coverage Configuration](COVERAGE-CONFIGURATION.md)
- [Testing Guide](TESTING.md)
- [Testing Examples](TESTING-EXAMPLES.md)
- [Test Coverage Plan](../TEST_COVERAGE_PLAN.md)
