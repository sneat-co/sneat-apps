---
format: https://specscore.md/feature-specification
status: Approved
---

# Feature: Extract Listus into a Dedicated Full-Stack Repo

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extract-listus-standalone-repo?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extract-listus-standalone-repo?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extract-listus-standalone-repo?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extract-listus-standalone-repo?op=request-change) |

**Status:** Approved
**Source Ideas:** extract-listus-standalone-repo

## Summary

Move the listus extension out of sneat-apps into a dedicated AGPL-3.0 full-stack repo (github.com/sneat-co/listus) with an Nx/Angular frontend and a Go backend scaffold, publish it as @sneat/extension-listus, and rewire sneat-apps to consume it.

## Problem

The listus extension (todo / shopping / watch lists) lives inside `sneat-apps` at `libs/extensions/listus`, coupling its lifecycle, build, release, and licensing to the monorepo. All of its `@sneat/*` dependencies are already published npm packages (v0.4.0) from `sneat-libs`, and it has exactly one consumer (`space-routing.module.ts`), so it is well-isolated and ready to extract. We want listus to be an independently-deployable full-stack product (`listus.app`) in its own AGPL-3.0 repo, with room for a dedicated Go backend, while sneat-apps continues to embed it as a normal npm dependency. The current package name `@sneat/extensions-listus` (plural) is a typo to be corrected to the singular `@sneat/extension-listus`.

## Behavior

### Repository Structure

#### REQ: repo-scaffold

A new repository `github.com/sneat-co/listus` is created locally (no GitHub remote until the publish step) with: an AGPL-3.0 `LICENSE` at the root; a `frontend/` directory holding an Nx/Angular workspace managed by pnpm (with `frontend/package.json`); a `backend/` directory holding a Go module (with `backend/go.mod`); and a brief `README.md` in every directory (root, `frontend/`, `backend/`, and each created app/lib). Neither `package.json` nor `go.mod` is at the repository root.

### Backend Scaffold

#### REQ: go-backend-scaffold

`backend/` is a self-contained Go module declared as `module github.com/sneat-co/listus/backend`. It builds with `go build ./...` and exposes a single health endpoint (e.g. `GET /health` returning `200`). No listus domain endpoints are implemented in this iteration.

### Library Migration

#### REQ: ext-listus-package

The listus source from `sneat-apps/libs/extensions/listus` is migrated into `frontend/libs/ext-listus` and is published under the singular package name `@sneat/extension-listus`. The migrated library type-checks and builds cleanly in the new workspace against the existing published `@sneat/*` dependencies (v0.4.0), preserving its public API (notably the `listusRoutes` export).

### Standalone App

#### REQ: listus-app-shell

`frontend/apps/listus-app` is an Nx/Angular/Ionic application that mirrors the sneat-app shell pattern (reusing published `@sneat/*` libs for auth and the space framework). It boots and renders the listus lists feature via `listusRoutes` from `@sneat/extension-listus`.

### sneat-apps Rewire

#### REQ: local-link-milestone

`sneat-apps` is rewired to consume `@sneat/extension-listus` via a pnpm local link: the local tsconfig path mapping for the old in-repo library is removed, the import in `space-routing.module.ts` is updated to the singular package name, and the lists feature works on a dev machine with no functional regression. This milestone proves the swap before anything is published.

#### REQ: publish-and-swap

`@sneat/extension-listus` is published to the registry (first version, e.g. `0.0.1`), and the pnpm local link in `sneat-apps` is replaced with a versioned dependency in `package.json`. `sneat-apps` builds and passes CI against the published package, with no functional regression in the lists feature.

### Naming Convention

#### REQ: naming-convention-doc

The singular `@sneat/extension-<name>` naming convention is documented in the `sneat-libs` repository `README.md`, establishing it as the standard for extension packages (listus only; schedulus/contactus are not renamed in this iteration).

## Acceptance Criteria

### AC: repo-scaffold-structure

Scenario: New repo has split toolchains and licensing
Given a fresh clone of the new `listus` repo
When the directory tree is inspected
Then `LICENSE` (AGPL-3.0) exists at the root, `frontend/package.json` and `backend/go.mod` exist, neither `package.json` nor `go.mod` is at the repo root, and a `README.md` exists at the root and in `frontend/` and `backend/`.

### AC: backend-builds-and-serves-health

Scenario: Go backend builds and answers health
Given the `backend/` Go module
When `go build ./...` runs and the server is started and `GET /health` is requested
Then the build succeeds and the health endpoint returns HTTP 200.

### AC: ext-listus-builds-under-singular-name

Scenario: Migrated library builds as the singular package
Given the migrated `frontend/libs/ext-listus` in the new workspace
When the library is built
Then it compiles successfully, its `package.json` name is `@sneat/extension-listus`, and it still exports `listusRoutes`.

### AC: listus-app-renders-lists

Scenario: Standalone app renders the lists feature
Given `frontend/apps/listus-app` running in dev
When an authenticated user navigates to the lists route
Then the listus lists UI renders without runtime errors.

### AC: sneat-apps-local-link-no-regression

Scenario: sneat-apps consumes the extension via local link
Given `sneat-apps` with the old tsconfig path removed and `@sneat/extension-listus` linked locally via pnpm
When `sneat-apps` is built and the lists feature is exercised on a dev machine
Then the import in `space-routing.module.ts` resolves to `@sneat/extension-listus` and the lists feature behaves identically to before the extraction.

### AC: sneat-apps-consumes-published-version

Scenario: sneat-apps depends on the published package in CI
Given `@sneat/extension-listus` published at a pinned version and `sneat-apps` depending on that version in `package.json`
When the `sneat-apps` CI build runs
Then it installs the published package, builds successfully, and the lists feature has no functional regression.

### AC: naming-convention-documented

Scenario: Convention recorded in sneat-libs
Given the `sneat-libs` repository README
When it is read
Then it documents the singular `@sneat/extension-<name>` naming convention for extension packages.

## Open Questions

- **Registry choice** for the publish step: public npm (matches schedulus precedent) vs GitHub Packages. Working assumption: public npm.
- **GitHub remote timing:** the remote is created together with the first publish (REQ: publish-and-swap); local `git init` only through the local-link milestone.
- **Frontend toolchain versions:** match sneat-apps' current Angular/Ionic/Nx versions vs latest compatible with `@sneat/*` peer ranges. Working assumption: match sneat-apps.

---

_This document follows the https://specscore.md/feature-specification_
