# Extract Debtus into a Dedicated Full-Stack Repo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the debtus frontend extension from sneat-apps into a new standalone full-stack repo `github.com/sneat-co/debtus` (private, AGPL-3.0) with a standalone `debtus-app` for `debtus.app` and a scaffold-only Go backend, then rewire sneat-apps to consume the published packages.

**Architecture:** Mirror the already-proven `listus` extraction at `/Users/alexandertrakhimenok/projects/sneat-co/listus`. New repo has two independent toolchains in subdirectories: `frontend/` (Nx 22 / Angular 21 / Ionic 8 / pnpm workspace) and `backend/` (Go module, health endpoint only). Unlike listus (which collapsed to a single `@sneat/extension-listus`), debtus keeps its existing **two** libs under their existing **`@sneat/*`** names: `@sneat/ext-debtus-shared` and `@sneat/ext-debtus-internal`. The real ~23k-LOC debtus Go domain and the `debtusbot` Telegram bot stay in sneat-go this iteration; the frontend reaches them via `@sneat/api`.

**Tech Stack:** Angular 21.2.x, Ionic 8.8.x, Nx 22.7.x, pnpm 11, ng-packagr, Vitest, Playwright, Go 1.26, published `@sneat/*` packages @ 0.4.0, public npm registry.

**Reference template (READ-ONLY, copy from here):** `/Users/alexandertrakhimenok/projects/sneat-co/listus`
**New repo path (to create):** `/Users/alexandertrakhimenok/projects/sneat-co/debtus`
**Source of migrated libs:** `/Users/alexandertrakhimenok/projects/sneat-co/sneat-apps/libs/extensions/debtus/{shared,internal}`

---

## Key facts established during spec/exploration (do not re-discover)

- **Two debtus libs, kept as-is:**
  - `@sneat/ext-debtus-shared` — `src/index.ts` is `export * from './lib/components';` (exports `NewDebtFormComponent`, `MemberDebtsSummaryComponent`, plus `DebtusService`).
  - `@sneat/ext-debtus-internal` — `src/index.ts` is `export * from './lib/pages/index';`, whose key export is `spacePagesRoutes` (the debtus routes). The internal home page imports `NewDebtFormComponent` from `@sneat/ext-debtus-shared`, so **internal depends on shared**.
- **The routes export is named `spacePagesRoutes`** (not `debtusRoutes`). Keep this name — renaming it is out of scope.
- **Single sneat-apps consumer:** `libs/space/pages/src/lib/space/space-routing.module.ts` line 4: `import { spacePagesRoutes } from '@sneat/ext-debtus-internal';` and spreads `...spacePagesRoutes` into `routes`.
- **tsconfig.base.json path maps** in sneat-apps (lines ~47–52) point `@sneat/ext-debtus-internal` and `@sneat/ext-debtus-shared` at local `libs/extensions/debtus/.../src/index.ts`.
- **@sneat/\* deps debtus imports:** `@sneat/api`, `@sneat/core`, `@sneat/contactus-core`, `@sneat/contactus-services`, `@sneat/space-models`, `@sneat/space-services`, `@sneat/space-components`, `@sneat/ui`, plus `@ionic/angular/standalone`. All are in the listus `frontend/package.json` already (copied in Task 3), so they resolve in the new workspace.

## File structure of the new repo (target)

```
debtus/
├── .github/workflows/{frontend.yml,backend.yml,e2e.yml}
├── .gitignore
├── LICENSE                         # AGPL-3.0
├── README.md                       # root overview
├── backend/
│   ├── go.mod                      # module github.com/sneat-co/debtus/backend
│   ├── README.md
│   ├── cmd/debtusd/main.go         # health endpoint only
│   └── internal/health/{health.go,health_test.go}
└── frontend/                       # Nx workspace (package.json here, not at root)
    ├── nx.json, package.json, tsconfig.base.json, eslint.config.mjs,
    │   .prettierrc, .prettierignore, .editorconfig, .gitignore,
    │   pnpm-workspace.yaml, project.json, vitest.workspace.ts, README.md
    ├── apps/
    │   ├── debtus-app/             # standalone shell (from listus-app)
    │   └── debtus-app-e2e/         # Playwright smoke (from listus-app-e2e)
    └── libs/
        ├── ext-debtus-shared/      # → @sneat/ext-debtus-shared
        └── ext-debtus-internal/    # → @sneat/ext-debtus-internal
```

---

## Phase A — Scaffold the new repo

### Task 1: Initialize repo, license, root README, gitignore

**Files:**

- Create: `/Users/alexandertrakhimenok/projects/sneat-co/debtus/LICENSE`
- Create: `/Users/alexandertrakhimenok/projects/sneat-co/debtus/README.md`
- Create: `/Users/alexandertrakhimenok/projects/sneat-co/debtus/.gitignore`

- [ ] **Step 1: Create the repo dir and git init**

```bash
mkdir -p /Users/alexandertrakhimenok/projects/sneat-co/debtus
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git init
```

- [ ] **Step 2: Copy the AGPL-3.0 LICENSE from the listus template verbatim**

```bash
cp /Users/alexandertrakhimenok/projects/sneat-co/listus/LICENSE \
   /Users/alexandertrakhimenok/projects/sneat-co/debtus/LICENSE
```

- [ ] **Step 3: Copy and adapt the root .gitignore**

```bash
cp /Users/alexandertrakhimenok/projects/sneat-co/listus/.gitignore \
   /Users/alexandertrakhimenok/projects/sneat-co/debtus/.gitignore
```

- [ ] **Step 4: Write the root README.md**

```markdown
# Debtus

Debtus — track who owes whom, settle debts, and exchange receipts. A standalone
full-stack product extracted from [sneat-apps](https://github.com/sneat-co/sneat-apps)
and [sneat-go](https://github.com/sneat-co/sneat-go).

This repo hosts two independent toolchains in subdirectories — neither
`package.json` nor `go.mod` lives at the repo root:

- `frontend/` — Nx/Angular/Ionic workspace; hosts `debtus-app` (debtus.app) and
  the `@sneat/ext-debtus-shared` / `@sneat/ext-debtus-internal` libraries.
- `backend/` — Go module (`github.com/sneat-co/debtus/backend`). Scaffold only
  (health endpoint) for now; the live debtus Go domain and Telegram bot remain
  in sneat-go this iteration.

**License:** [AGPL-3.0](LICENSE)
```

- [ ] **Step 5: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add LICENSE README.md .gitignore
git commit -m "chore: init debtus repo with AGPL-3.0 license and root README"
```

---

### Task 2: Scaffold the Go backend (health endpoint only)

**Files:**

- Create: `backend/go.mod`
- Create: `backend/cmd/debtusd/main.go`
- Create: `backend/internal/health/health.go`
- Create: `backend/internal/health/health_test.go`
- Create: `backend/README.md`

- [ ] **Step 1: Copy the listus backend tree, then rename listus→debtus**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
cp -R listus/backend debtus/backend
rm -rf debtus/backend/cmd/listusd
mkdir -p debtus/backend/cmd/debtusd
cp listus/backend/cmd/listusd/main.go debtus/backend/cmd/debtusd/main.go
```

- [ ] **Step 2: Set the Go module path**

Edit `debtus/backend/go.mod` — change the module line to:

```
module github.com/sneat-co/debtus/backend
```

(Keep the `go 1.26` directive from the template.)

- [ ] **Step 3: Rewrite `backend/cmd/debtusd/main.go`**

```go
// Command debtusd is the debtus backend service.
//
// This is a scaffold: it currently exposes only a health endpoint. Debtus
// domain endpoints are intentionally not implemented yet — the live debtus Go
// domain remains in sneat-go for now.
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/sneat-co/debtus/backend/internal/health"
)

func main() {
	addr := os.Getenv("DEBTUS_ADDR")
	if addr == "" {
		addr = ":8080"
	}

	mux := http.NewServeMux()
	mux.Handle("GET /health", health.Handler())

	log.Printf("debtusd listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("debtusd failed: %v", err)
	}
}
```

- [ ] **Step 4: Verify `internal/health/health.go` and its test need no changes**

The health package has no listus-specific identifiers. Run:

```bash
grep -ri "listus" /Users/alexandertrakhimenok/projects/sneat-co/debtus/backend/internal/
```

Expected: no output. If any match appears, replace `listus`→`debtus` in that file.

- [ ] **Step 5: Adapt `backend/README.md`**

Replace listus references with debtus. Minimal content:

```markdown
# Debtus backend

Go module `github.com/sneat-co/debtus/backend`.

Scaffold only — exposes a `/health` endpoint. Debtus domain endpoints are not
implemented here yet (the live debtus Go domain remains in sneat-go).

## Requirements

- Go 1.26+

## Run

    cd backend
    go run ./cmd/debtusd        # listens on :8080 (override with DEBTUS_ADDR)

## Test

    cd backend
    go test ./...
```

- [ ] **Step 6: Build and test the backend**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/backend
go build ./... && go test ./...
```

Expected: build succeeds; health test PASSES.

- [ ] **Step 7: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add backend
git commit -m "feat(backend): scaffold debtus Go module with health endpoint"
```

---

### Task 3: Scaffold the frontend Nx workspace skeleton (no app/libs yet)

**Files (copy from listus `frontend/`, then adapt):**

- Create: `frontend/nx.json`, `frontend/package.json`, `frontend/tsconfig.base.json`, `frontend/eslint.config.mjs`, `frontend/.prettierrc`, `frontend/.prettierignore`, `frontend/.editorconfig`, `frontend/.gitignore`, `frontend/pnpm-workspace.yaml`, `frontend/project.json`, `frontend/vitest.workspace.ts`, `frontend/README.md`, `frontend/.vscode/*`, `frontend/.verdaccio/config.yml`

- [ ] **Step 1: Copy the listus frontend workspace-level config files (exclude apps, libs, lockfile, node_modules, dist, tmp)**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
mkdir -p debtus/frontend
cp listus/frontend/nx.json            debtus/frontend/nx.json
cp listus/frontend/tsconfig.base.json debtus/frontend/tsconfig.base.json
cp listus/frontend/eslint.config.mjs  debtus/frontend/eslint.config.mjs
cp listus/frontend/.prettierrc        debtus/frontend/.prettierrc
cp listus/frontend/.prettierignore    debtus/frontend/.prettierignore
cp listus/frontend/.editorconfig      debtus/frontend/.editorconfig
cp listus/frontend/.gitignore         debtus/frontend/.gitignore
cp listus/frontend/pnpm-workspace.yaml debtus/frontend/pnpm-workspace.yaml
cp listus/frontend/project.json       debtus/frontend/project.json
cp listus/frontend/vitest.workspace.ts debtus/frontend/vitest.workspace.ts
cp -R listus/frontend/.vscode         debtus/frontend/.vscode
cp -R listus/frontend/.verdaccio      debtus/frontend/.verdaccio
```

- [ ] **Step 2: Write `frontend/package.json`** — copy listus's, change only `name` and `license`, keep all dependencies/devDependencies identical (they include every `@sneat/*` debtus needs at 0.4.0)

Copy `listus/frontend/package.json` to `debtus/frontend/package.json`, then change:

```json
  "name": "@sneat/debtus-frontend",
  "license": "AGPL-3.0",
```

Leave `dependencies` and `devDependencies` exactly as in the listus template.

- [ ] **Step 3: Fix `frontend/nx.json` release projects**

In `debtus/frontend/nx.json`, set the `release.projects` array to the two debtus libs (replace listus's `["api", "ext-listus"]`):

```json
  "release": {
    "projects": ["ext-debtus-shared", "ext-debtus-internal"],
    "projectsRelationship": "independent",
    "docker": {
      "skipVersionActions": true
    },
    "version": {
      "preVersionCommand": "pnpm dlx nx run-many -t build"
    }
  },
```

Also remove the `"nxCloudId"` line (new repo has no Nx Cloud workspace) or leave it — if builds fail with an Nx Cloud auth error, remove it.

- [ ] **Step 4: Reset `frontend/tsconfig.base.json` path mappings**

Open `debtus/frontend/tsconfig.base.json`. Remove any listus path entries (e.g. `@sneat/extension-listus`). Set `compilerOptions.paths` to map only the two debtus libs (these will exist after Tasks 4–5):

```json
    "paths": {
      "@sneat/ext-debtus-shared": ["libs/ext-debtus-shared/src/index.ts"],
      "@sneat/ext-debtus-internal": ["libs/ext-debtus-internal/src/index.ts"]
    }
```

Keep all other `compilerOptions` from the template unchanged.

- [ ] **Step 5: Adapt `frontend/README.md`** — replace listus→debtus in names/paths/commands (serve `debtus-app`, build, test, e2e).

- [ ] **Step 6: Install dependencies (generates a fresh lockfile)**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm install
```

Expected: install completes; `pnpm-lock.yaml` created. (No projects to build yet.)

- [ ] **Step 7: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add frontend
git commit -m "chore(frontend): scaffold Nx/Angular workspace skeleton from listus template"
```

---

## Phase B — Migrate the two debtus libs

### Task 4: Migrate `ext-debtus-shared`

**Files:**

- Create: `frontend/libs/ext-debtus-shared/**` (copied source)
- Create/replace: `frontend/libs/ext-debtus-shared/project.json`, `package.json`, `ng-package.json`, `tsconfig*.json`

- [ ] **Step 1: Copy the shared lib source from sneat-apps**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
mkdir -p debtus/frontend/libs/ext-debtus-shared
cp -R sneat-apps/libs/extensions/debtus/shared/. debtus/frontend/libs/ext-debtus-shared/
```

- [ ] **Step 2: Rewrite `libs/ext-debtus-shared/project.json`** (fix `sourceRoot`/build paths to the new flat location; mirror listus's ext-listus project.json conventions but keep the existing test executor)

```json
{
  "name": "ext-debtus-shared",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/ext-debtus-shared/src",
  "prefix": "sneat-debtus",
  "projectType": "library",
  "release": {
    "version": {
      "manifestRootsToUpdate": ["dist/{projectRoot}"],
      "currentVersionResolver": "git-tag",
      "fallbackCurrentVersionResolver": "disk"
    }
  },
  "tags": ["type:lib", "scope:debtus"],
  "targets": {
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/ext-debtus-shared/ng-package.json",
        "tsConfig": "libs/ext-debtus-shared/tsconfig.lib.json"
      },
      "configurations": {
        "production": { "tsConfig": "libs/ext-debtus-shared/tsconfig.lib.prod.json" },
        "development": {}
      },
      "defaultConfiguration": "production"
    },
    "nx-release-publish": { "options": { "packageRoot": "dist/{projectRoot}" } },
    "test": {
      "executor": "@nx/vitest:test",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": { "tsConfig": "libs/ext-debtus-shared/tsconfig.spec.json" }
    },
    "lint": { "executor": "@nx/eslint:lint" }
  }
}
```

- [ ] **Step 3: Set real peerDependencies in `libs/ext-debtus-shared/package.json`** (so the published package declares what it needs; mirrors listus's ext-listus package.json style)

```json
{
  "name": "@sneat/ext-debtus-shared",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^21.0.0",
    "@angular/core": "^21.0.0",
    "@angular/forms": "^21.0.0",
    "@ionic/angular": "^8.0.0",
    "rxjs": "^7.0.0",
    "@sneat/api": "^0.4.0",
    "@sneat/core": "^0.4.0",
    "@sneat/contactus-core": "^0.4.0",
    "@sneat/space-components": "^0.4.0",
    "@sneat/space-models": "^0.4.0",
    "@sneat/ui": "^0.4.0"
  },
  "dependencies": { "tslib": "^2.3.0" },
  "sideEffects": false
}
```

- [ ] **Step 4: Verify the tsconfig files reference correct relative paths**

`tsconfig.json`, `tsconfig.lib.json`, `tsconfig.lib.prod.json`, `tsconfig.spec.json` were copied from the deeper `libs/extensions/debtus/shared/` location. Open each and confirm `extends` points to `../../tsconfig.base.json` (two levels up from `libs/ext-debtus-shared/`). The original was nested 4 levels (`../../../../`). Fix the `extends` and any `outDir`/`include` relative paths to match the new 2-level depth.

- [ ] **Step 5: Build the lib**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm exec nx build ext-debtus-shared
```

Expected: ng-packagr build SUCCEEDS, output in `dist/libs/ext-debtus-shared`.
If it fails on an unresolved `@sneat/*` import, confirm that dep is present in `frontend/package.json` (it should be — listus template includes all) and re-run `pnpm install`.

- [ ] **Step 6: Lint and test the lib**

Run:

```bash
pnpm exec nx lint ext-debtus-shared && pnpm exec nx test ext-debtus-shared
```

Expected: lint passes; vitest specs (`debtus-service.spec.ts`, component specs, `sanity.spec.ts`) PASS.

- [ ] **Step 7: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add frontend/libs/ext-debtus-shared frontend/tsconfig.base.json
git commit -m "feat(frontend): migrate @sneat/ext-debtus-shared into debtus repo"
```

---

### Task 5: Migrate `ext-debtus-internal`

**Files:**

- Create: `frontend/libs/ext-debtus-internal/**` (copied source)
- Create/replace: `project.json`, `package.json`, `tsconfig*.json`

- [ ] **Step 1: Copy the internal lib source from sneat-apps**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
mkdir -p debtus/frontend/libs/ext-debtus-internal
cp -R sneat-apps/libs/extensions/debtus/internal/. debtus/frontend/libs/ext-debtus-internal/
```

- [ ] **Step 2: Rewrite `libs/ext-debtus-internal/project.json`**

```json
{
  "name": "ext-debtus-internal",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/ext-debtus-internal/src",
  "prefix": "sneat-debtus",
  "projectType": "library",
  "release": {
    "version": {
      "manifestRootsToUpdate": ["dist/{projectRoot}"],
      "currentVersionResolver": "git-tag",
      "fallbackCurrentVersionResolver": "disk"
    }
  },
  "tags": ["type:lib", "scope:debtus"],
  "targets": {
    "build": {
      "executor": "@nx/angular:package",
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"],
      "options": {
        "project": "libs/ext-debtus-internal/ng-package.json",
        "tsConfig": "libs/ext-debtus-internal/tsconfig.lib.json"
      },
      "configurations": {
        "production": { "tsConfig": "libs/ext-debtus-internal/tsconfig.lib.prod.json" },
        "development": {}
      },
      "defaultConfiguration": "production"
    },
    "nx-release-publish": { "options": { "packageRoot": "dist/{projectRoot}" } },
    "test": {
      "executor": "@nx/vitest:test",
      "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
      "options": { "tsConfig": "libs/ext-debtus-internal/tsconfig.spec.json" }
    },
    "lint": { "executor": "@nx/eslint:lint" }
  }
}
```

- [ ] **Step 3: Set peerDependencies in `libs/ext-debtus-internal/package.json`** (internal depends on shared — declare it)

```json
{
  "name": "@sneat/ext-debtus-internal",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^21.0.0",
    "@angular/core": "^21.0.0",
    "@angular/router": "^21.0.0",
    "@ionic/angular": "^8.0.0",
    "rxjs": "^7.0.0",
    "@sneat/ext-debtus-shared": "^0.0.1",
    "@sneat/contactus-services": "^0.4.0",
    "@sneat/space-components": "^0.4.0",
    "@sneat/space-models": "^0.4.0",
    "@sneat/space-services": "^0.4.0",
    "@sneat/core": "^0.4.0",
    "@sneat/ui": "^0.4.0"
  },
  "dependencies": { "tslib": "^2.3.0" },
  "sideEffects": false
}
```

- [ ] **Step 4: Fix tsconfig `extends`/relative paths** for the new 2-level depth (same as Task 4 Step 4, for the internal lib's `tsconfig*.json`).

- [ ] **Step 5: Build the internal lib (depends on shared via tsconfig path)**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm exec nx build ext-debtus-internal
```

Expected: build SUCCEEDS. The `@sneat/ext-debtus-shared` import resolves via the tsconfig.base path added in Task 3 Step 4.

- [ ] **Step 6: Lint and test**

Run:

```bash
pnpm exec nx lint ext-debtus-internal && pnpm exec nx test ext-debtus-internal
```

Expected: lint passes; `sanity.spec.ts` PASSES.

- [ ] **Step 7: Verify the routes export is intact**

Run:

```bash
grep -rn "spacePagesRoutes" /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend/libs/ext-debtus-internal/src
```

Expected: definition in `lib/pages/space-pages-routing.ts` and re-export through `lib/pages/index` → `src/index.ts`.

- [ ] **Step 8: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add frontend/libs/ext-debtus-internal
git commit -m "feat(frontend): migrate @sneat/ext-debtus-internal into debtus repo"
```

---

## Phase C — Standalone debtus-app + CI

### Task 6: Create `debtus-app` (standalone shell)

**Files:**

- Create: `frontend/apps/debtus-app/**` (from listus-app, renamed)
- Create: `frontend/apps/debtus-app/src/app/space/debtus-space.routes.ts`

- [ ] **Step 1: Copy the listus-app and rename the directory**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
cp -R listus/frontend/apps/listus-app debtus/frontend/apps/debtus-app
rm -f debtus/frontend/apps/debtus-app/src/app/space/listus-space.routes.ts
```

- [ ] **Step 2: Rename listus→debtus in app config files**

In `debtus/frontend/apps/debtus-app/project.json`: change `"name": "listus-app"` → `"debtus-app"`, and every `apps/listus-app` path → `apps/debtus-app`, and output `dist/apps/listus-app` → `dist/apps/debtus-app`. Do the same renames in `eslint.config.mjs`, `tsconfig.app.json`, `tsconfig.spec.json`, `tsconfig.json`, `vitest.config.ts` if they reference the app path/name.

- [ ] **Step 3: Rewrite `src/main.ts`** (set appId/appTitle to debtus)

```ts
// Main entry point for debtus.app
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { getStandardSneatProviders, provideAppInfo, provideRolesByType } from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { App } from './app/app';
import { appRoutes } from './app/app.routes';
import { debtusAppEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(App, {
  providers: [...getStandardSneatProviders(debtusAppEnvironmentConfig), provideAppInfo({ appId: 'debtus', appTitle: 'debtus.app' }), provideRouter([...appRoutes, ...authRoutes]), provideRolesByType(undefined)],
}).catch((err) => console.error(err));

registerIonicons();
```

- [ ] **Step 4: Rename the environment export**

In `src/environments/environment.ts`, rename the exported const `listusAppEnvironmentConfig` → `debtusAppEnvironmentConfig`. Update any other `listus` strings (e.g. app id/title literals) to `debtus`. Keep the Firebase config from the template (dev runs against the existing sneat backend per the spec).

- [ ] **Step 5: Rewrite `src/app/app.routes.ts`** (point to the debtus space routes file)

```ts
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    // Space-scoped routes host the debtus pages, mirroring sneat-app's
    // space/:spaceType/:spaceID mount point.
    path: 'space/:spaceType/:spaceID',
    loadChildren: () => import('./space/debtus-space.routes').then((m) => m.debtusSpaceRoutes),
  },
];
```

- [ ] **Step 6: Create `src/app/space/debtus-space.routes.ts`** (mount ONLY the debtus routes; note `spacePagesRoutes` is the export name)

```ts
import { Route } from '@angular/router';
import { spacePagesRoutes } from '@sneat/ext-debtus-internal';
import { SpaceComponentBaseParams, SpaceMenuComponent } from '@sneat/space-components';

// Thin, debtus-only space shell. It provides SpaceComponentBaseParams (which
// resolves the active space from the :spaceType/:spaceID route params) to all
// children, then mounts ONLY the debtus routes — unlike sneat-app's
// @sneat/space-pages, which bundles every extension. This keeps debtus.app
// decoupled while reusing the published @sneat/space-components context wiring.
export const debtusSpaceRoutes: Route[] = [
  {
    path: '',
    providers: [SpaceComponentBaseParams],
    children: [
      {
        path: '',
        component: SpaceMenuComponent,
        outlet: 'menu',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'debts',
      },
      ...spacePagesRoutes,
    ],
  },
];
```

- [ ] **Step 7: Update app spec files**

In `src/app/app.routes.spec.ts` and `src/app/app.spec.ts`, replace any `listus`/`listusSpaceRoutes`/`listusAppEnvironmentConfig` references with the debtus equivalents (`debtusSpaceRoutes`, `debtusAppEnvironmentConfig`). Update the redirect-target assertion from `lists` → `debts` if present.

- [ ] **Step 8: Update `src/index.html` and `src/styles.scss`** — replace any `listus` title/text with `debtus`.

- [ ] **Step 9: Build the app**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm exec nx build debtus-app
```

Expected: production build SUCCEEDS, output in `dist/apps/debtus-app`.

- [ ] **Step 10: Lint + unit test the app**

Run:

```bash
pnpm exec nx lint debtus-app && pnpm exec nx test debtus-app
```

Expected: PASS.

- [ ] **Step 11: Smoke-serve and manually confirm the debts page renders**

Run:

```bash
pnpm exec nx serve debtus-app
```

Open `http://localhost:4200/`, sign in, navigate to a `space/.../debts` route, and confirm the debtus home page renders against the existing sneat backend. Stop the server.

- [ ] **Step 12: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add frontend/apps/debtus-app
git commit -m "feat(frontend): add standalone debtus-app shell mounting debtus routes"
```

---

### Task 7: Add the e2e smoke project

**Files:**

- Create: `frontend/apps/debtus-app-e2e/**` (from listus-app-e2e)

- [ ] **Step 1: Copy and rename**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
cp -R listus/frontend/apps/listus-app-e2e debtus/frontend/apps/debtus-app-e2e
```

- [ ] **Step 2: Rename listus→debtus in e2e config**

In `debtus/frontend/apps/debtus-app-e2e/project.json`, `playwright.config.ts`, `eslint.config.mjs`, `tsconfig.json`: change `listus-app-e2e`→`debtus-app-e2e`, `listus-app`→`debtus-app` (including the `webServer`/serve target the e2e drives and any baseURL/port references).

- [ ] **Step 3: Update the smoke spec**

In `src/smoke.spec.ts`, replace listus-specific assertions/titles with debtus equivalents (e.g. expected page title `debtus.app`). Keep the test a minimal "app boots / redirects to login" smoke check.

- [ ] **Step 4: Run the e2e smoke test**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm exec playwright install --with-deps chromium
pnpm exec nx e2e debtus-app-e2e
```

Expected: smoke test PASSES (app boots, redirect/login visible).

- [ ] **Step 5: Commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
git add frontend/apps/debtus-app-e2e
git commit -m "test(frontend): add debtus-app e2e smoke test"
```

---

### Task 8: Add CI workflows

**Files:**

- Create: `.github/workflows/frontend.yml`, `.github/workflows/backend.yml`, `.github/workflows/e2e.yml`

- [ ] **Step 1: Copy the three workflows**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co
mkdir -p debtus/.github/workflows
cp listus/.github/workflows/frontend.yml debtus/.github/workflows/frontend.yml
cp listus/.github/workflows/backend.yml  debtus/.github/workflows/backend.yml
cp listus/.github/workflows/e2e.yml      debtus/.github/workflows/e2e.yml
```

- [ ] **Step 2: Rename listus→debtus references**

In all three files replace `listus`→`debtus` (workflow names, the `listus-app-e2e` project ref in `e2e.yml` → `debtus-app-e2e`). The path filters already use `frontend/**` / `backend/**` and need no change.

- [ ] **Step 3: Sanity-check workflow YAML locally**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
grep -rl "listus" .github/ || echo "clean"
```

Expected: `clean` (no remaining listus references).

- [ ] **Step 4: Commit**

```bash
git add .github
git commit -m "ci: add frontend, backend, and e2e workflows"
```

---

## Phase D — Rewire sneat-apps (local link → publish + swap)

> These tasks happen in the **sneat-apps** repo: `/Users/alexandertrakhimenok/projects/sneat-co/sneat-apps`. Work on the existing branch `spec/extract-debtus-standalone-repo` (or a new branch off it).

### Task 9: Local-link milestone — validate no regression

**Files:**

- Modify: `sneat-apps/tsconfig.base.json` (the `@sneat/ext-debtus-*` path entries, ~lines 47–52)
- Modify: `sneat-apps/package.json` (add local-link deps)

- [ ] **Step 1: Build the publishable libs in the debtus repo**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm exec nx build ext-debtus-shared && pnpm exec nx build ext-debtus-internal
```

Expected: both `dist/libs/ext-debtus-shared` and `dist/libs/ext-debtus-internal` produced.

- [ ] **Step 2: Add pnpm local-link dependencies in sneat-apps**

In `sneat-apps/package.json` `dependencies`, add (pointing at the built dist dirs):

```json
    "@sneat/ext-debtus-shared": "link:../debtus/frontend/dist/libs/ext-debtus-shared",
    "@sneat/ext-debtus-internal": "link:../debtus/frontend/dist/libs/ext-debtus-internal",
```

- [ ] **Step 3: Remove the local source path mappings so the link resolves**

In `sneat-apps/tsconfig.base.json`, delete the two `@sneat/ext-debtus-internal` and `@sneat/ext-debtus-shared` path-map entries (so TS resolves them from `node_modules` via the link instead of local source).

- [ ] **Step 4: Install**

Run:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
pnpm install
```

Expected: install links both packages into `node_modules/@sneat/`.

- [ ] **Step 5: Build sneat-app and verify the consumer compiles**

Run:

```bash
pnpm exec nx build sneat-app
```

Expected: build SUCCEEDS. The unchanged consumer `libs/space/pages/src/lib/space/space-routing.module.ts` (`import { spacePagesRoutes } from '@sneat/ext-debtus-internal'`) now resolves from the linked package.

- [ ] **Step 6: Smoke-test the debts feature in sneat-app**

Run `pnpm exec nx serve sneat-app`, sign in, open a space's debts page, confirm no functional regression (debts list + new-debt form render and work). Stop the server.

- [ ] **Step 7: Commit the local-link state (transition checkpoint — do NOT merge to main)**

```bash
git add package.json tsconfig.base.json pnpm-lock.yaml
git commit -m "chore(debtus): consume @sneat/ext-debtus-* via pnpm local link (transition)"
```

> ⚠️ This local-link commit is a validation checkpoint only. The end state is Task 10 (versioned npm deps). Do not merge the link commit to main.

---

### Task 10: Publish to public npm + swap sneat-apps to versioned deps

**Files:**

- Modify: `sneat-apps/package.json` (replace link: with versioned deps)
- Delete from sneat-apps: `libs/extensions/debtus/` (now sourced from npm) — **only after** the versioned build is green
- Create remote: `github.com/sneat-co/debtus` (private)

- [ ] **Step 1: Create the private GitHub repo and push debtus**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus
gh repo create sneat-co/debtus --private --source=. --remote=origin
git push -u origin HEAD
```

- [ ] **Step 2: Publish both libs to public npm at 0.0.1**

Run from the debtus frontend (ensure you are `npm login`'d with publish rights to the `@sneat` scope; packages are `publishConfig.access: public` by scope policy):

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/debtus/frontend
pnpm exec nx build ext-debtus-shared && pnpm exec nx build ext-debtus-internal
cd dist/libs/ext-debtus-shared   && npm publish --access public && cd -
cd dist/libs/ext-debtus-internal && npm publish --access public && cd -
```

Expected: `@sneat/ext-debtus-shared@0.0.1` and `@sneat/ext-debtus-internal@0.0.1` published.
Verify:

```bash
npm view @sneat/ext-debtus-shared version
npm view @sneat/ext-debtus-internal version
```

- [ ] **Step 3: Swap sneat-apps deps from link: to versioned**

In `sneat-apps/package.json`, replace the two `link:` entries with:

```json
    "@sneat/ext-debtus-shared": "0.0.1",
    "@sneat/ext-debtus-internal": "0.0.1",
```

- [ ] **Step 4: Remove the migrated source from sneat-apps**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
git rm -r libs/extensions/debtus
```

(The path mappings were already removed in Task 9 Step 3. Confirm no other project references `libs/extensions/debtus`.)

- [ ] **Step 5: Install and build**

Run:

```bash
pnpm install
pnpm exec nx build sneat-app
```

Expected: install pulls `@sneat/ext-debtus-*@0.0.1` from npm; build SUCCEEDS against the published packages.

- [ ] **Step 6: Run affected lint/test**

Run:

```bash
pnpm exec nx affected -t lint test
```

Expected: PASS.

- [ ] **Step 7: Smoke-test the debts feature once more** against the versioned dependency (serve sneat-app, open debts page).

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat(debtus): consume published @sneat/ext-debtus-* 0.0.1; remove migrated source from sneat-apps"
```

- [ ] **Step 9: Open PR for the sneat-apps rewire** (the debtus-repo work lives in its own repo already).

```bash
gh pr create --fill --base main
```

---

## Self-Review (completed)

- **Spec coverage:** MVP steps 1–5 → Tasks 1–3 (scaffold), 4–5 (lib migration), 6–7 (standalone app + e2e), 9 (local-link milestone), 10 (publish + swap). Backend scaffold → Task 2. AGPL/READMEs → Tasks 1, 2, 3. CI → Task 8. ✓
- **"Not doing" respected:** No Go domain/bot moved; backend is health-only (Task 2). debtus stays consumed (removed source replaced by npm dep, not deleted from the product). Package names/scope preserved (`@sneat/ext-debtus-{shared,internal}`). ✓
- **Type/name consistency:** routes export is `spacePagesRoutes` throughout (Tasks 5, 6); app shell uses `debtusSpaceRoutes` + `debtusAppEnvironmentConfig` consistently (Task 6); lib names `ext-debtus-shared`/`ext-debtus-internal` consistent across project.json, nx.json release list, tsconfig paths, and consumer. ✓
- **Open items flagged, not hidden:** debtus.app hosting wiring, private-repo + public-npm split, toolchain version pinning, and future Go extraction remain Open Questions in the spec and are intentionally out of this plan's scope.

```

```
