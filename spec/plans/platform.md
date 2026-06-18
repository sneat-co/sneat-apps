---
format: https://specscore.md/plan-specification
status: Draft
---
# Plan: Platform: Third-Party Extension Platform (master)

**Status:** Draft
**Source:** none
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —

## Summary

Master plan that executes the third-party extension platform by orchestrating its five child plans (each `**Parent:** platform`): `extension-host-and-bridge` (F1), `extension-consent-and-scopes` (F2), `protected-data-gateway` (F3), `extension-permission-management-ui` (F4), and `trusted-first-party-extensions` (F5). It owns no implementation tasks of its own — each child plan owns its tasks and AC coverage; this plan owns the **execution order, the worktree/branch isolation policy, and the integration into a single pull request.**

## Approach

**Isolation policy (mandatory).** Every child plan is implemented by a dedicated subagent working in its **own git worktree on its own dedicated branch** — never in the shared working tree, never two agents on one branch. Per-plan branches are named `feat/ext-platform-<feature>` (e.g. `feat/ext-platform-host-bridge`) and cut from the umbrella branch `feat/ext-platform` (itself cut from `main`). When a child plan completes (its tasks done, its Feature ACs verified, lint/build/tests green in its worktree), its branch is merged into `feat/ext-platform` and its worktree removed. Final integration is a **single pull request** `feat/ext-platform` → `main`. This policy applies to any subagent execution of these plans, whether driven from this master plan or a child plan directly.

**Dependency-ordered waves.** The order follows the Features' dependency graph (all five Feature and child-plan interfaces are already approved, so waves are about integration order, not interface discovery):

- **Wave 1 — F1 (foundation):** the platform lib, sandboxed iframe host, bridge/RPC, registry, dynamic `frame-src` allowlist, manifest pipeline, deregistration, menu. Everything depends on it, so it lands first and merges to the umbrella before the rest integrate.
- **Wave 2 — F2 (consent & scopes):** the scope catalog + consent store + install consent flow (untrusted path). F3 and F4 consume its interfaces.
- **Wave 3 (parallel) — F3 (gateway) and F4 (permission UI):** both depend on F1 + F2; they run concurrently in separate worktrees once F2's interfaces are merged to the umbrella.
- **Wave 4 — F5 (trusted first-party):** depends on F1 only and owns the install-time trusted/untrusted fork + gateway-bypass; sequenced last so it integrates against the settled untrusted path.

F5 may begin in parallel with Wave 2/3 (it needs only F1), but it integrates last to keep the trusted/untrusted fork reconciliation in one place.

## Tasks

### Task 1: Establish umbrella branch and per-plan worktrees

**Depends-On:** —
**Status:** pending

Cut the umbrella branch `feat/ext-platform` from `main`. For each child plan, create a dedicated git worktree on a dedicated branch `feat/ext-platform-<feature>` cut from the umbrella. No implementation happens in the shared working tree.

### Task 2: Execute F1 — extension-host-and-bridge (foundation)

**Depends-On:** 1
**Status:** pending

In worktree/branch `feat/ext-platform-host-bridge`, a dedicated subagent executes every task of the `extension-host-and-bridge` child plan until its 13 Feature ACs are verified and lint/build/tests are green; then merge the branch into `feat/ext-platform`. This is the foundation and must integrate before Waves 2–4.

### Task 3: Execute F2 — extension-consent-and-scopes

**Depends-On:** 2
**Status:** pending

In worktree/branch `feat/ext-platform-consent`, a dedicated subagent executes the `extension-consent-and-scopes` child plan (catalog, consent store, untrusted install/consent flow) until its ACs are verified and green; then merge into `feat/ext-platform`. Provides the consent-store interface F3 and F4 consume.

### Task 4: Execute F3 — protected-data-gateway

**Depends-On:** 3
**Status:** pending

In worktree/branch `feat/ext-platform-gateway`, a dedicated subagent executes the `protected-data-gateway` child plan (method-scope map, enforcement against the consent store, picker, field-gating) until its ACs are verified and green; then merge into `feat/ext-platform`. Runs in parallel with Task 5.

### Task 5: Execute F4 — extension-permission-management-ui

**Depends-On:** 3
**Status:** pending

In worktree/branch `feat/ext-platform-permissions-ui`, a dedicated subagent executes the `extension-permission-management-ui` child plan (pure consumer: list, granted-scopes, trusted badge, revoke, remove) until its ACs are verified and green; then merge into `feat/ext-platform`. Runs in parallel with Task 4.

### Task 6: Execute F5 — trusted-first-party-extensions

**Depends-On:** 2
**Status:** pending

In worktree/branch `feat/ext-platform-trusted`, a dedicated subagent executes the `trusted-first-party-extensions` child plan (trusted-origin allowlist, token handoff/refresh, install-time fork ownership, gateway-bypass, full-access disclosure) until its ACs are verified and green; then merge into `feat/ext-platform` last so the trusted/untrusted fork reconciles against the integrated untrusted path.

### Task 7: Integrate on the umbrella and open one pull request

**Depends-On:** 2, 3, 4, 5, 6
**Status:** pending

On `feat/ext-platform` with all child branches merged, run the full lint/build/test suite and a cross-plan end-to-end check (the kept demo extension exercising host + consent + gateway + permission UI, and a trusted-class smoke test), resolve any integration issues, then open a single pull request `feat/ext-platform` → `main`.

## Open Questions

- **F5 start timing:** F5 needs only F1, so its subagent MAY start as soon as Task 2 merges (in parallel with Waves 2–3); it is sequenced to *integrate* last (Task 6 before Task 7) rather than to *start* last. Confirm at execution time based on agent capacity.
- **Per-plan PRs vs one PR:** this plan integrates via a single umbrella PR (chosen). If finer review is wanted, individual `feat/ext-platform-<feature>` branches can each open their own PR into the umbrella instead.

---
*This document follows the https://specscore.md/plan-specification*
