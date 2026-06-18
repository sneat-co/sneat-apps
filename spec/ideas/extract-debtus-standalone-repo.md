---
format: https://specscore.md/idea-specification
status: Approved
---

# Idea: Extract Debtus into a Dedicated Full-Stack Repo

**Status:** Approved
**Date:** 2026-06-16
**Owner:** alex
**Promotes To:** —
**Supersedes:** —
**Related Ideas:** extends:extract-listus-standalone-repo

## Problem Statement

How might we extract the debtus extension into a self-contained, independently-deployable full-stack repository (frontend + Go backend) under a new private `github.com/sneat-co/debtus` repo with its own `debtus.app`, without destabilizing sneat-apps or sneat-go, while reusing the extraction pattern already proven for listus?

## Context

Triggered by the same decoupling effort that produced `extract-listus-standalone-repo`. Debtus has two halves with very different extraction profiles:

**Frontend (in sneat-apps).** Debtus lives at `libs/extensions/debtus/{shared,internal}` as two local libs — `@sneat/ext-debtus-shared` (public components/services: `NewDebtFormComponent`, `MemberDebtsSummaryComponent`, `DebtusService`) and `@sneat/ext-debtus-internal` (pages + routing, exports `spacePagesRoutes`). All of its dependencies are already-published external `@sneat/*` packages (v0.4.0: `@sneat/api`, `@sneat/core`, `@sneat/contactus-core`, `@sneat/contactus-services`, `@sneat/space-models`, `@sneat/space-services`, `@sneat/space-components`, `@sneat/ui`). It has exactly ONE consumer outside itself: `libs/space/pages/src/lib/space/space-routing.module.ts` (imports `spacePagesRoutes`). This mirrors listus almost exactly and is straightforward to migrate. There is no `apps/debtus-app` yet (old standalone code is archived in `src_old/apps/debtus/`). Toolchain: Angular 21, Ionic 8, Nx 22, pnpm 11.

**Backend (in sneat-go).** This is where debtus diverges sharply from listus, whose backend was scaffold-only. Debtus has a real, large, deeply entangled Go backend: ~23,000 LOC across ~189 `.go` files under `pkg/modules/debtus` (subpackages `models4debtus`, `facade4debtus`, `debtusdal`, `dal4debtus`, `common4debtus`, `const4debtus`, `api/api4debtus`, `api/api4transfers`, plus SMS/OneSignal/analytics/webhooks). It also has a **live production Telegram bot** (`debtusbot` under `pkg/bots/botprofiles/debtusbot`, wired in `pkg/bots/botinit/bots_telegram.go` and `pkg/sneatmain/sneat_main.go`) and bidirectional coupling with **splitus**, **reminders**, and **invites**. A dormant `//replace github.com/sneat-co/sneat-mod-debtus-go` line in `go.mod` hints at a prior extraction attempt. Because of this entanglement, a full Go extraction is a separate, large, higher-risk project — out of scope for this iteration.

## Recommended Direction

Create a new **private** repo `github.com/sneat-co/debtus` (AGPL-3.0) with two top-level toolchains, mirroring the listus structure:

- `frontend/` — an Nx/Angular workspace containing `apps/debtus-app` (mirrors the sneat-app shell pattern, reusing `@sneat/*` libs for auth and spaces) plus the migrated `libs/ext-debtus-shared` and `libs/ext-debtus-internal`, keeping their existing `@sneat/*` package names.
- `backend/` — a Go module rooted at `backend/` (path `github.com/sneat-co/debtus/backend`), **scaffold-only with a health endpoint**. The real debtus Go domain and the `debtusbot` Telegram bot stay in sneat-go this iteration; the frontend continues to call them via `@sneat/api`.

`package.json` lives under `frontend/`, `go.mod` under `backend/` — neither at repo root. Migrate the debtus frontend source from `sneat-apps/libs/extensions/debtus` into `frontend/libs/`. Rewire sneat-apps' single consumer (`space-routing.module.ts`) to consume the package — first via a pnpm local link during transition, then via the published versioned dependency. Publish the extension packages to **public npm** (keeping the `@sneat/*` scope; the `@debtus/` in the request refers to the repo/org, not the npm scope). Add a brief `README.md` to every directory.

## Alternatives Considered

- **Full Go extraction now** (move all of `pkg/modules/debtus` + `debtusbot` into `debtus/backend` and rewire sneat-go to depend on it). Lost as an MVP choice: the live production Telegram bot plus bidirectional splitus/reminders/invites/sneatmain coupling make this a large, higher-risk, multi-stage effort that would dominate and destabilize the extraction. Deferred to a documented future phase.
- **Phased: extract the self-contained Go core (models/facade/dal/api), leave the bot in sneat-go.** Lost for this iteration for the same reason — even the "self-contained" core is reached by the bot, reminders, and splitus, so the seam is not clean enough to land safely alongside the frontend work. Revisit once the frontend extraction is stable.
- **Move debtus into the existing `sneat-libs` repo** instead of a new dedicated repo. Lost because it would not give debtus its own `debtus.app` frontend app or a home for a future dedicated Go backend, and it couples debtus's release cadence and AGPL licensing to the broader shared-libs repo. The goal is an independent, full-stack product.
- **Leave debtus in sneat-apps.** Lost because it does not achieve the decoupling goal: debtus stays entangled with the monorepo's build/release, with no standalone `debtus.app`.

## MVP Scope

The extraction itself, verifiable end-to-end, in sequence:

1. New private debtus repo scaffolded locally with `frontend/` Nx workspace (pnpm), `backend/` Go module (health endpoint only), AGPL-3.0 LICENSE, and per-directory READMEs.
2. Debtus frontend source migrated into `frontend/libs/ext-debtus-shared` and `frontend/libs/ext-debtus-internal`, building cleanly under their existing `@sneat/*` package names.
3. `apps/debtus-app` boots on a sneat-app-style shell and renders the debtus feature (`spacePagesRoutes`).
4. **Local-link milestone:** sneat-apps rewired to consume the extracted packages via a pnpm local link, verifying no functional regression in the debtus feature on a dev machine. This proves the swap works before anything is published.
5. **Publish + swap:** publish the extension packages to public npm (first version, e.g. 0.0.1) and replace the local link in sneat-apps with a versioned dependency, so sneat-apps builds and passes CI against the published packages.

No real debtus Go API in this iteration. The backend is scaffold-only. The local link in step 4 is a transition-only validation, not the end state — CI consumption requires the published packages from step 5.

## Not Doing (and Why)

- Real debtus Go API endpoints — backend is scaffold-only (health endpoint) this iteration
- Moving `pkg/modules/debtus` or the `debtusbot` Telegram bot out of sneat-go — full Go extraction is a deferred future phase; the live bot + splitus/reminders/invites coupling is too entangled to land safely now
- Removing debtus from sneat-apps — it remains a consumed dependency, not deleted
- Renaming the debtus extension packages off the `@sneat/*` scope or collapsing the shared/internal split — names and structure are preserved
- Custom branding, onboarding, or marketing surfaces for debtus.app beyond the reused sneat-app shell

## Key Assumptions to Validate

| Tier           | Assumption                                                                                                                                                                   | How to validate                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Must-be-true   | All of debtus's `@sneat/*` dependencies are installable from npm at versions compatible with a fresh Nx/Angular workspace.                                                   | In the new `frontend/` workspace, `pnpm add` each `@sneat/*` dep at the version sneat-apps uses (0.4.0) and confirm both `ext-debtus-*` libs type-check and build. |
| Must-be-true   | `apps/debtus-app` can boot debtus on a sneat-app-style shell using only the published `@sneat/*` libs (auth + space framework), without copying private sneat-app internals. | Stand up the shell, wire `spacePagesRoutes`, and confirm the debtus page renders against a real space-scoped session in dev.                                       |
| Must-be-true   | The scaffold-only `backend/` does not block the frontend: debtus continues to reach the existing debtus Go backend in sneat-go via `@sneat/api`.                             | Run `apps/debtus-app` against the existing sneat-go backend and confirm debt/transfer reads/writes work unchanged.                                                 |
| Should-be-true | sneat-apps can consume the extracted packages via a pnpm local link cleanly enough to validate no regression before any npm publish.                                         | Link the packages, swap the import in `space-routing.module.ts`, build sneat-apps, and smoke-test the debtus feature.                                              |
| Should-be-true | A Go module rooted at `backend/` (path `github.com/sneat-co/debtus/backend`) builds and runs standalone with `go.mod` not at repo root.                                      | `cd backend && go build ./... && go run` the health endpoint.                                                                                                      |
| Might-be-true  | The debtus Go domain + `debtusbot` can later be extracted into `debtus/backend` without breaking sneat-go's splitus/reminders/invites/bot wiring.                            | Spike the seam in a future phase; revisit the dormant `sneat-mod-debtus-go` replace approach.                                                                      |

## SpecScore Integration

- **New Features this would create:** likely a single "Extract debtus into a dedicated full-stack repo" Feature covering repo scaffold, frontend code migration, standalone app shell, backend scaffold, and the sneat-apps rewire. May split the sneat-apps rewire (local-link consumption + publish swap) into its own Feature if it proves independently shippable.
- **Existing Features affected:** sneat-apps debtus routing (`space-routing.module.ts` consumer).
- **Dependencies:** published `@sneat/*` packages (v0.4.0); pnpm; Nx/Angular/Ionic toolchain; Go toolchain. Existing debtus Go backend in sneat-go (unchanged, consumed via `@sneat/api`).

## Open Questions

- **debtus.app hosting:** which hosting target for the standalone app (Firebase Hosting reusing a sneat project vs a dedicated debtus Firebase project / custom domain wiring)? (Working assumption: stand up dev against the existing sneat backend first; wire `debtus.app` hosting as part of the publish/launch step.)
- **Private repo + public npm:** the repo is private but the extension packages publish publicly to npm (mirroring listus tooling). Confirm this split is acceptable, or move to GitHub Packages (private) later if package contents must stay private.
- **Frontend toolchain versions:** pin `debtus.app` to the exact Angular/Ionic/Nx versions sneat-apps uses today, or start on the latest compatible with the `@sneat/*` peer ranges? (Working assumption: match sneat-apps to minimize migration risk.)
- **GitHub remote timing:** keep the repo local through step 4 and create the private `github.com/sneat-co/debtus` remote + publish together in step 5? (Working assumption: yes, mirroring the listus sequencing.)
- **Future Go extraction phasing:** when and how to extract the real debtus Go domain and `debtusbot` from sneat-go (the deferred large project). (Working assumption: separate idea/spec once the frontend extraction is stable.)
