---
format: https://specscore.md/plan-specification
status: Executing
---
# Plan: Platform: Third-Party Extension Platform (master)

**Status:** Executing
**Source:** none
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —
**Grade:** A

## Summary

Master plan that executes the third-party extension platform by orchestrating its five child plans (each `**Parent:** platform`): `extension-host-and-bridge` (F1), `extension-consent-and-scopes` (F2), `protected-data-gateway` (F3), `extension-permission-management-ui` (F4), and `trusted-first-party-extensions` (F5). It owns no implementation tasks of its own — each child plan owns its tasks and AC coverage; this plan owns the **execution order, the worktree/branch isolation policy, and the integration into a single pull request.**

## Approach

**Isolation policy (mandatory).** Every child plan is implemented by a dedicated subagent working in its **own git worktree on its own dedicated branch** — never in the shared working tree, never two agents on one branch. Per-plan branches are named `feat/ext-platform-<feature>` (e.g. `feat/ext-platform-host-bridge`) and cut from the umbrella branch `feat/ext-platform` (itself cut from `main`). When a child plan completes (its tasks done, its Feature ACs verified, lint/build/tests green in its worktree), its branch is merged into `feat/ext-platform` and its worktree removed. Final integration is a **single pull request** `feat/ext-platform` → `main`. This policy applies to any subagent execution of these plans, whether driven from this master plan or a child plan directly.

**Agent granularity (plan-level, fixed).** Exactly **one dedicated subagent owns each child plan** and executes all of that plan's tasks itself, sequentially, in the plan's `Depends-On` order, inside that plan's single worktree. Child plans do **not** fan out further subagents per task — task-level parallelism is intentionally not used, so there is exactly **one worktree + one branch per child plan** and no intra-plan branch merging. Concurrency therefore exists **across plans only**: the plans whose dependencies are satisfied run at once, with peak concurrency of ~3 (F3, F4, and F5 — F5 needs only F1 so it may already be in flight before F2 integrates; see the F5-start-timing note). Five plan-owning subagents exist over the lifetime of the effort, never one-per-task.

**Quality bar (definition of done).** Every child plan must land with **good unit-test coverage of the code it adds** — not merely its acceptance criteria. Each plan-owning subagent writes unit tests alongside the implementation, so a child branch's merge gate into `feat/ext-platform` is: **its Feature ACs verified + lint + build + unit tests green, with good coverage of the new/changed code.** "Good coverage" means the meaningful branches and edge cases of the new logic are exercised — e.g. origin verification (accept/reject), scope enforcement (granted vs. ungranted/declined/revoked), manifest structural-validation failures, field-gating on/off, revoke/remove effects, and the trusted/untrusted fork — favouring behaviour-covering tests over a raw percentage. A child plan is not "done" (and its branch must not merge) until this bar is met; Task 7 additionally runs the full suite across the integrated umbrella.

**Dependency-ordered waves.** The order follows the Features' dependency graph (all five Feature and child-plan interfaces are already approved, so waves are about integration order, not interface discovery):

- **Wave 1 — F1 (foundation):** the platform lib, sandboxed iframe host, bridge/RPC, registry, dynamic `frame-src` allowlist, manifest pipeline, deregistration, menu. Everything depends on it, so it lands first and merges to the umbrella before the rest integrate.
- **Wave 2 — F2 (consent & scopes):** the scope catalog + consent store + install consent flow (untrusted path). F3 and F4 consume its interfaces.
- **Wave 3 (parallel) — F3 (gateway) and F4 (permission UI):** both depend on F1 + F2; they run concurrently in separate worktrees once F2's interfaces are merged to the umbrella.
- **Wave 4 — F5 (trusted first-party):** depends on F1 only and owns the install-time trusted/untrusted fork + gateway-bypass; sequenced last so it integrates against the settled untrusted path.

F5 may begin in parallel with Wave 2/3 (it needs only F1), but it integrates last to keep the trusted/untrusted fork reconciliation in one place.

## Tasks

### Task 1: Establish umbrella branch and per-plan worktrees

**Depends-On:** —
**Status:** done

Cut the umbrella branch `feat/ext-platform` from `main`. For each child plan, create a dedicated git worktree on a dedicated branch `feat/ext-platform-<feature>` cut from the umbrella. No implementation happens in the shared working tree.

### Task 2: Execute F1 — extension-host-and-bridge (foundation)

**Depends-On:** 1
**Status:** done

In worktree/branch `feat/ext-platform-host-bridge`, a dedicated subagent executes every task of the `extension-host-and-bridge` child plan until its 13 Feature ACs are verified and lint/build/tests are green; then merge the branch into `feat/ext-platform`. This is the foundation and must integrate before Waves 2–4.

### Task 3: Execute F2 — extension-consent-and-scopes

**Depends-On:** 2
**Status:** done

In worktree/branch `feat/ext-platform-consent`, a dedicated subagent executes the `extension-consent-and-scopes` child plan (catalog, consent store, untrusted install/consent flow) until its ACs are verified and green; then merge into `feat/ext-platform`. Provides the consent-store interface F3 and F4 consume.

### Task 4: Execute F3 — protected-data-gateway

**Depends-On:** 3
**Status:** done

In worktree/branch `feat/ext-platform-gateway`, a dedicated subagent executes the `protected-data-gateway` child plan (method-scope map, enforcement against the consent store, picker, field-gating) until its ACs are verified and green; then merge into `feat/ext-platform`. Runs in parallel with Task 5.

### Task 5: Execute F4 — extension-permission-management-ui

**Depends-On:** 3
**Status:** pending

In worktree/branch `feat/ext-platform-permissions-ui`, a dedicated subagent executes the `extension-permission-management-ui` child plan (pure consumer: list, granted-scopes, trusted badge, revoke, remove) until its ACs are verified and green; then merge into `feat/ext-platform`. Runs in parallel with Task 4. Note: F4's **trusted-badge** path reads F5's `isTrustedOrigin` predicate (the static trusted-origin allowlist, `trusted-first-party-extensions` Task 1), which integrates with F5 in Task 6 — so F4's own ACs (list, empty-state, granted-scopes, revoke, remove) are fully verifiable at this wave, while the `trusted-extension-shows-full-access-badge` AC is verified at umbrella integration (Task 7) once F5's allowlist is present.

### Task 6: Execute F5 — trusted-first-party-extensions

**Depends-On:** 2
**Status:** pending

In worktree/branch `feat/ext-platform-trusted`, a dedicated subagent executes the `trusted-first-party-extensions` child plan (trusted-origin allowlist, token handoff/refresh, install-time fork ownership, gateway-bypass, full-access disclosure) until its ACs are verified and green; then merge into `feat/ext-platform` last so the trusted/untrusted fork reconciles against the integrated untrusted path.

### Task 7: Integrate on the umbrella and open one pull request

**Depends-On:** 2, 3, 4, 5, 6
**Status:** pending

On `feat/ext-platform` with all child branches merged, run the full lint/build/test suite and a cross-plan end-to-end check, resolve any integration issues, then open a single pull request `feat/ext-platform` → `main`. The integration check MUST cover the cross-wave couplings that no single child wave can fully exercise: (a) the kept demo extension exercising host + consent + read-only gateway + permission UI end to end (untrusted path); (b) F4's `trusted-extension-shows-full-access-badge` against F5's now-present trusted-origin allowlist; (c) a trusted-class smoke test exercising F5's token-handoff path (not the untrusted gateway path); and (d) the install-time `isTrustedOrigin` fork routes a trusted origin to F5's full-access disclosure and an untrusted origin to F2's per-scope consent.

## Open Questions

- **F5 start timing:** F5 needs only F1, so its subagent MAY start as soon as Task 2 merges (in parallel with Waves 2–3); it is sequenced to *integrate* last (Task 6 before Task 7) rather than to *start* last. Confirm at execution time based on agent capacity.
- **Per-plan PRs vs one PR:** this plan integrates via a single umbrella PR (chosen). If finer review is wanted, individual `feat/ext-platform-<feature>` branches can each open their own PR into the umbrella instead.

---
*This document follows the https://specscore.md/plan-specification*
