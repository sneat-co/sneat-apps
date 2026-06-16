---
format: https://specscore.md/idea-specification
status: Specified
---

# Idea: Extract Listus into a Dedicated Full-Stack Repo

**Status:** Specified
**Date:** 2026-06-16
**Owner:** alex
**Promotes To:** extract-listus-standalone-repo
**Supersedes:** —
**Related Ideas:** —

## Problem Statement

How might we extract the listus extension into a self-contained, independently-deployable full-stack repository (frontend + Go backend) without destabilizing sneat-apps, while adopting a cleaner singular extension- naming convention?

## Context

Triggered by a decoupling investigation. Listus currently lives in sneat-apps at libs/extensions/listus (pure frontend, talking to Firestore + the shared sneat-go-backend via @sneat/api). All 13 of its @sneat/\* dependencies are ALREADY published external npm packages (v0.4.0) from the separate sneat-libs repo, including the space/contactus base classes it extends. It has exactly ONE consumer outside itself: libs/space/pages/src/lib/space/space-routing.module.ts (imports listusRoutes). The schedulus extension already sets the precedent of an extension published from sneat-libs and consumed by sneat-apps as an external npm dependency. The current package name @sneat/extensions-listus (plural) is considered a typo to be corrected to singular @sneat/extension-listus. Package manager is pnpm.

## Recommended Direction

Create a new public repo github.com/sneat-co/listus (AGPL-3.0) with two top-level toolchains: frontend/ (an Nx/Angular workspace containing apps/listus-app, which mirrors the sneat-app shell pattern — reusing @sneat/\* libs for auth and spaces — plus libs/ext-listus published as @sneat/extension-listus, singular) and backend/ (a Go module rooted at backend/, scaffold-only with a health endpoint). package.json lives under frontend/, go.mod under backend/ — neither at repo root. Migrate the listus source from sneat-apps/libs/extensions/listus into frontend/libs/ext-listus. Rewire sneat-apps to consume @sneat/extension-listus (swap the local tsconfig path for a dependency via a pnpm local link during transition; rename the plural import to singular). Document the singular extension- naming convention in the sneat-libs README. Add a brief README.md to every directory.

## Alternatives Considered

- **Move listus into the existing `sneat-libs` repo** (alongside schedulus/assetus) instead of a new dedicated repo. Lost because it would not give listus its own `listus.app` frontend app or a place for a dedicated Go backend, and it couples listus's release cadence and AGPL licensing to the broader (differently-licensed) shared-libs repo. The goal is an independent, full-stack product, not another shared lib.
- **Leave listus in `sneat-apps`, just rename plural → singular.** Lost because it does not achieve the stated decoupling goal: listus stays entangled with the monorepo's build/release, and there is still no standalone `listus.app` or backend home.
- **Build a real Go backend now (full lists/items API).** Lost as an MVP choice: it roughly doubles the scope into a second product, while listus already works against Firestore + the shared `sneat-go-backend`. The `backend/` directory is scaffolded so the structure exists, but real endpoints are deferred.

## MVP Scope

The extraction itself, verifiable end-to-end, in sequence:

1. New listus repo scaffolded locally with frontend/ Nx workspace (pnpm), backend/ Go module (health endpoint only), AGPL-3.0 LICENSE, and per-directory READMEs.
2. Listus source migrated into frontend/libs/ext-listus and building cleanly as @sneat/extension-listus.
3. apps/listus-app boots on a sneat-app-style shell and renders the lists feature.
4. **Local-link milestone:** sneat-apps rewired to consume @sneat/extension-listus via a pnpm local link, verifying no functional regression in the lists feature on a dev machine. This proves the swap works before anything is published.
5. **Publish + swap:** publish @sneat/extension-listus to the registry (first version, e.g. 0.0.1) and replace the local link in sneat-apps with a versioned dependency, so sneat-apps builds and passes CI against the published package.

No real Go API in this iteration. The local link in step 4 is a transition-only validation, not the end state — CI consumption requires the published package from step 5.

## Not Doing (and Why)

- Real listus Go API endpoints — backend is scaffold-only (health endpoint) this iteration
- Removing listus from sneat-apps — it remains a consumed dependency, not deleted
- Renaming schedulus or contactus to the new convention — listus only for now
- Custom branding, onboarding, or marketing surfaces for listus.app beyond the reused sneat-app shell

## Key Assumptions to Validate

| Tier           | Assumption                                                                                                                                                                                                        | How to validate                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Must-be-true   | All of listus's `@sneat/*` dependencies (incl. `space-components`, `space-services`, `contactus-services`, `contactus-shared`) are installable from npm at versions compatible with a fresh Nx/Angular workspace. | In the new `frontend/` workspace, `pnpm add` each `@sneat/*` dep at the version sneat-apps uses (0.4.0) and confirm `ext-listus` type-checks and builds. |
| Must-be-true   | `apps/listus-app` can boot listus on a sneat-app-style shell using only the published `@sneat/*` libs (auth + space framework), without copying private sneat-app internals.                                      | Stand up the shell, wire `listusRoutes`, and confirm the lists page renders against a real/space-scoped session in dev.                                  |
| Should-be-true | sneat-apps can consume `@sneat/extension-listus` via a pnpm local link (`file:`/`link:` or pnpm workspace) cleanly enough to validate no regression before any npm publish.                                       | Link the package, swap the import in `space-routing.module.ts`, build sneat-apps, and smoke-test the lists feature.                                      |
| Should-be-true | A Go module rooted at `backend/` (path `github.com/sneat-co/listus/backend`) builds and runs standalone with `go.mod` not at repo root.                                                                           | `cd backend && go build ./... && go run` the health endpoint.                                                                                            |
| Might-be-true  | The singular `extension-` naming convention is the right long-term pattern for all extensions (schedulus, contactus, etc.), not just listus.                                                                      | Document it in the sneat-libs README and revisit when migrating the next extension.                                                                      |

## SpecScore Integration

- **New Features this would create:** likely a single "Extract listus into a dedicated full-stack repo" Feature covering repo scaffold, code migration, standalone app shell, backend scaffold, and the sneat-apps rewire. May split the sneat-apps rewire (rename + local-link consumption) into its own Feature if it proves independently shippable.
- **Existing Features affected:** sneat-apps lists/listus routing (`space-routing.module.ts` consumer); sneat-libs README (naming-convention doc).
- **Dependencies:** published `@sneat/*` packages (v0.4.0) from sneat-libs; pnpm; Nx/Angular/Ionic toolchain; Go toolchain.

## Open Questions

- **Registry for the publish step:** public npm (matches the schedulus precedent, fits the public AGPL repo) vs GitHub Packages (token-authed, non-public). (Working assumption: public npm.)
- **Frontend toolchain versions:** pin `listus.app` to the exact Angular/Ionic/Nx versions sneat-apps uses today, or start on the latest compatible with the `@sneat/*` peer ranges? (Working assumption: match sneat-apps to minimize migration risk.)
- **GitHub remote timing:** publishing to a registry (step 5) generally pairs with pushing the repo to `github.com/sneat-co/listus`. Confirm whether to create the GitHub remote as part of the publish step or keep it local until a later explicit step. (Working assumption: local `git init` through step 4; create remote + publish together in step 5.)
