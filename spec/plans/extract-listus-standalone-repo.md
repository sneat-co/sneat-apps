---
format: https://specscore.md/plan-specification
status: Approved
---

# Plan: Extract Listus Standalone Repo

**Status:** Implemented
**Source Feature:** extract-listus-standalone-repo
**Date:** 2026-06-16
**Owner:** alexandertrakhimenok
**Supersedes:** —

## Summary

Extract the listus extension from `sneat-apps` into a dedicated AGPL-3.0 full-stack repo (`github.com/sneat-co/listus`) with a pnpm-managed Nx/Angular frontend and a scaffold-only Go backend, publish it as `@sneat/extension-listus` (singular), rewire `sneat-apps` to consume it, and document the naming convention in `sneat-libs`. Spans three repos: the new `listus` repo, `sneat-apps` (consumer), and `sneat-libs` (convention doc).

## Approach

Strictly linear, matching the Idea's sequenced MVP and respecting cross-task dependencies: the repo skeleton (T1) must exist before the backend (T2), library migration (T3), and app shell (T4) land inside it; the migrated `ext-listus` (T3) must build before the app (T4) can render it; both must be green before `sneat-apps` is rewired via local link (T5); the local-link milestone must pass before publishing and swapping to a versioned dependency (T6). The naming-convention doc (T7) targets a different repo (`sneat-libs`) and is independent, ordered last. The local link (T5) is a transition-only validation gate before any publish (T6).

## Tasks

### Task 1: Scaffold the listus repo skeleton

**Verifies:** extract-listus-standalone-repo#ac:repo-scaffold-structure
**Depends-On:** —
**Status:** done

Create the new repo locally (`git init`, no remote) with an AGPL-3.0 `LICENSE` at the root, a `frontend/` pnpm-managed Nx/Angular workspace (`frontend/package.json`), a `backend/` Go module (`backend/go.mod`, module path `github.com/sneat-co/listus/backend`), and a brief `README.md` at the root and in `frontend/` and `backend/`. Neither `package.json` nor `go.mod` sits at the repo root.

### Task 2: Implement the Go backend health endpoint

**Verifies:** extract-listus-standalone-repo#ac:backend-builds-and-serves-health
**Depends-On:** 1
**Status:** done

In `backend/`, implement a minimal HTTP server exposing `GET /health` returning HTTP 200, confirm `go build ./...` succeeds and the endpoint responds. No listus domain endpoints in this iteration.

### Task 3: Migrate listus into frontend/libs/ext-listus

**Verifies:** extract-listus-standalone-repo#ac:ext-listus-builds-under-singular-name
**Depends-On:** 1
**Status:** done

Move the listus source from `sneat-apps/libs/extensions/listus` into `frontend/libs/ext-listus`, set the package `name` to `@sneat/extension-listus`, add the existing published `@sneat/*` dependencies (v0.4.0) via pnpm, and confirm the library type-checks and builds while preserving its public API (notably the `listusRoutes` export).

### Task 4: Build the listus-app shell that renders lists

**Verifies:** extract-listus-standalone-repo#ac:listus-app-renders-lists
**Depends-On:** 3
**Status:** done

Create `frontend/apps/listus-app` mirroring the sneat-app shell pattern (reusing published `@sneat/*` auth + space libs), wire `listusRoutes` from `@sneat/extension-listus`, and confirm an authenticated user can navigate to the lists route and the listus lists UI renders without runtime errors.

### Task 5: Rewire sneat-apps via pnpm local link (no-regression milestone)

**Verifies:** extract-listus-standalone-repo#ac:sneat-apps-local-link-no-regression
**Depends-On:** 4
**Status:** done

In `sneat-apps`, remove the local tsconfig path for the old in-repo listus library, update the import in `space-routing.module.ts` to the singular `@sneat/extension-listus`, link the package locally via pnpm, build, and smoke-test the lists feature on a dev machine for no functional regression. This gates the publish.

### Task 6: Publish @sneat/extension-listus and swap to a versioned dependency

**Verifies:** extract-listus-standalone-repo#ac:sneat-apps-consumes-published-version
**Depends-On:** 5
**Status:** done

Publish `@sneat/extension-listus` at a first pinned version (e.g. `0.0.1`) — creating the GitHub remote at this step — replace the pnpm local link in `sneat-apps` with that versioned dependency in `package.json`, and confirm `sneat-apps` builds and passes CI against the published package with no functional regression.

### Task 7: Document the singular extension- naming convention in sneat-libs

**Verifies:** extract-listus-standalone-repo#ac:naming-convention-documented
**Depends-On:** —
**Status:** done

Update the `sneat-libs` repository `README.md` to document the singular `@sneat/extension-<name>` naming convention as the standard for extension packages (listus only; schedulus/contactus not renamed this iteration).

### Task 8: E2E + smoke test for listus-app

**Verifies:** extract-listus-standalone-repo#ac:listus-app-renders-lists
**Depends-On:** 4
**Status:** done

Add an end-to-end test for `frontend/apps/listus-app` (Nx e2e project, e.g. Playwright/Cypress per the workspace default) that boots the app and asserts the lists route renders, and run a smoke test confirming the app starts and the lists UI loads without console errors. Added per user request; complements the runtime check in Task 4.

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/plan-specification_
