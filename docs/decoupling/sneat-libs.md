# sneat-libs — Workspace Setup & Migration Plan

> **Goal**: Create a standalone `sneat-libs` Nx workspace, move all shared `@sneat/*`
> libraries into it, and publish them as public NPM packages. This is Phase 1 of the
> [DataTug decoupling plan](datatug.md).
>
> Once complete, `sneat-apps`, `datatug`, and `logist` all consume `@sneat/*` as regular
> NPM packages — hard boundaries enforced by TypeScript package resolution.

---

## Table of Contents

1. [Library Inventory & Dependency Order](#1-library-inventory--dependency-order)
2. [Create the Workspace](#2-create-the-workspace)
3. [Migrate Each Library](#3-migrate-each-library)
4. [Configure NPM Publishing](#4-configure-npm-publishing)
5. [Local Dev Bridge (pnpm overrides)](#5-local-dev-bridge-pnpm-overrides)
6. [Transition sneat-apps to Consume from NPM](#6-transition-sneat-apps-to-consume-from-npm)
7. [Verification Checklist](#7-verification-checklist)

---

## 1. Library Inventory & Dependency Order

Libraries must be migrated in topological order (dependencies before dependents).
All are currently in `sneat-apps/libs/`.

| #   | Package                 | Source path in sneat-apps | Internal `@sneat/*` deps                                                                         | Lib type   |
| --- | ----------------------- | ------------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| 1   | `@sneat/core`           | `libs/core`               | _(none)_                                                                                         | Angular    |
| 2   | `@sneat/ui`             | `libs/ui`                 | _(none)_                                                                                         | Angular    |
| 3   | `@sneat/data`           | `libs/data`               | _(none — core is test-only)_                                                                     | TS         |
| 4   | `@sneat/grid`           | `libs/grid`               | _(none — core is test-only)_                                                                     | TS         |
| 5   | `@sneat/auth-models`    | `libs/auth/models`        | `core`                                                                                           | TS         |
| 6   | `@sneat/api`            | `libs/api`                | `core`                                                                                           | Angular    |
| 7   | `@sneat/logging`        | `libs/logging`            | `core`                                                                                           | Angular    |
| 8   | `@sneat/dto`            | `libs/dto`                | `auth-models`, `core`                                                                            | TS         |
| 9   | `@sneat/space-models`   | `libs/space/models`       | `core`, `data`, `dto`                                                                            | TS         |
| 10  | `@sneat/auth-core`      | `libs/auth/core`          | `api`, `auth-models`, `core`, `dto`                                                              | Angular    |
| 11  | `@sneat/datagrid`       | `libs/datagrid`           | `core`, `grid`                                                                                   | Angular    |
| 12  | `@sneat/contactus-core` | `libs/contactus/core`     | `auth-models`, `core`, `dto`, `space-models`                                                     | TS/Angular |
| 13  | `@sneat/components`     | `libs/components`         | `auth-core`, `core`, `data`, `ui`                                                                | Angular    |
| 14  | `@sneat/auth-ui`        | `libs/auth/ui`            | `api`, `auth-core`, `auth-models`, `core`, `space-models`, `ui`                                  | Angular    |
| 15  | `@sneat/space-services` | `libs/space/services`     | `api`, `auth-core`, `auth-models`, `contactus-core`, `core`, `data`, `dto`, `space-models`, `ui` | Angular    |

**External packages already on NPM** (not moving, just dependencies):

- `@sneat/random` — used by `auth-core`, `auth-ui`
- `@sneat/wormhole` — used by `datatug-main`

---

## 2. Create the Workspace

### 2.1 Scaffold

```bash
# Run from the parent directory that will contain all 4 repos side-by-side
pnpm dlx create-nx-workspace@latest sneat-libs \
  --preset=ts \
  --packageManager=pnpm \
  --nxCloud=skip \
  --name=sneat-libs
cd sneat-libs
```

`--preset=ts` gives a clean workspace without a default app. Angular plugin is added next.

### 2.2 Install Required Plugins

```bash
pnpm nx add @nx/angular      # for Angular libs (ng-packagr build)
pnpm nx add @nx/js           # for pure TS libs
pnpm nx add @nx/eslint        # linting
pnpm nx add @nx/vite          # vitest testing
```

Match the Angular version in `sneat-apps`:

```bash
# Check current version
node -e "require('./node_modules/@angular/core/package.json').version" 2>/dev/null \
  || cat /path/to/sneat-apps/package.json | grep '"@angular/core"'
```

### 2.3 Configure `nx.json`

```json
{
  "defaultBase": "main",
  "targetDefaults": {
    "build": { "dependsOn": ["^build"], "cache": true },
    "test": { "cache": true },
    "lint": { "cache": true }
  },
  "release": {
    "projects": ["*"],
    "version": { "conventionalCommits": true },
    "changelog": { "workspaceChangelog": true }
  }
}
```

### 2.4 Configure `tsconfig.base.json`

Copy the relevant path aliases from `sneat-apps/tsconfig.base.json` for the 15 libs
being moved. These will be removed from `sneat-apps` in Phase 6.

---

## 3. Migrate Each Library

Repeat this process for each library in the order listed in §1.

### Per-lib Migration Steps

#### Step A — Copy source files

```bash
# Example for @sneat/core
cp -r /path/to/sneat-apps/libs/core libs/core
```

#### Step B — Generate Nx project config

For **Angular libs** (types: Angular, Angular components/services):

```bash
pnx generate @nx/angular:library \
  --name=<lib-name> \
  --directory=libs/<path> \
  --publishable \
  --importPath=@sneat/<lib-name> \
  --buildable \
  --style=scss \
  --unitTestRunner=none    # we copy the existing spec files
```

For **pure TS libs** (data, grid, auth-models, dto, space-models, contactus-core):

```bash
pnx generate @nx/js:library \
  --name=<lib-name> \
  --directory=libs/<path> \
  --publishable \
  --importPath=@sneat/<lib-name> \
  --bundler=tsc \
  --unitTestRunner=none
```

> **Note**: After generation, overwrite the scaffolded `src/` with the copied source.
> The generator creates a `project.json` and `package.json` — keep those, replace `src/`.

#### Step C — Verify `package.json`

Each lib's `package.json` (created by the generator) must have:

```json
{
  "name": "@sneat/<lib-name>",
  "version": "0.1.0",
  "publishConfig": { "access": "public" },
  "peerDependencies": {
    "@angular/core": ">=21.0.0",
    "@angular/common": ">=21.0.0"
  }
}
```

Angular-specific libs should also peer-depend on `@ionic/angular` if they use Ionic components.
Pure TS libs have no Angular peer dependency.

#### Step D — Update imports within the lib

Imports of other `@sneat/*` libs stay as-is (they resolve via `tsconfig.base.json` paths
during development, and via `node_modules` when consumed as NPM packages).

#### Step E — Build and test

```bash
pnx build <lib-name>
pnx test <lib-name>
pnx lint <lib-name>
```

Fix any compilation errors before moving to the next lib.

### Library-Specific Notes

**`@sneat/core`** — Contains `ErrorLogger`, `AnalyticsService` tokens/interfaces. No
Angular peer deps beyond `@angular/core`. Build as Angular lib (uses decorators).

**`@sneat/ui`** — Base modal and selector components. Uses `@ionic/angular`.
Add `@ionic/angular` as peer dependency.

**`@sneat/logging`** — Contains Firebase Analytics, Sentry, PostHog implementations.
Requires `firebase`, `@angular/fire`, `posthog-js`, `@sentry/angular` as peer deps
(or regular deps, depending on whether consumers must install them separately).

**`@sneat/auth-core`** — Depends on `@angular/fire/auth` for Firebase Authentication.
Add `firebase` and `@angular/fire` as peer dependencies.

**`@sneat/auth-ui`** — Contains login/logout UI. Uses `@ionic/angular`, `@angular/fire`.

**`@sneat/space-services`** — Highest in the dependency tree. Verify build last.

---

## 4. Configure NPM Publishing

### 4.1 Use `nx release`

`nx release` handles versioning, changelog, and publishing across all packages.

```bash
# Dry-run to verify what would be published
pnx release --dry-run

# Bump version and publish
pnx release
```

Configured in `nx.json` (see §2.3). Uses conventional commits for automatic version bumping.

### 4.2 NPM Org

Packages publish under `@sneat/` scope. Requires:

- NPM org `sneat` to exist with public publishing enabled
- `NPM_TOKEN` secret in CI

### 4.3 CI Pipeline (GitHub Actions)

Create `.github/workflows/release.yml`:

```yaml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - run: pnpm nx release --yes
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Also add a CI workflow (`.github/workflows/ci.yml`) that runs
`pnx run-many -t build,test,lint --all` on every PR.

---

## 5. Local Dev Bridge (pnpm overrides)

During active development of shared libs — before publishing to NPM — consuming
workspaces (`sneat-apps`, `datatug`) can point to the local built output.

### 5.1 Build sneat-libs locally

```bash
# In sneat-libs/
pnx run-many -t build --all
```

Output lands in `sneat-libs/dist/libs/<lib-path>/`.

### 5.2 Add overrides in consuming workspace

In `sneat-apps/package.json` (and similarly `datatug/package.json`):

```json
{
  "pnpm": {
    "overrides": {
      "@sneat/core": "file:../sneat-libs/dist/libs/core",
      "@sneat/ui": "file:../sneat-libs/dist/libs/ui",
      "@sneat/data": "file:../sneat-libs/dist/libs/data",
      "@sneat/grid": "file:../sneat-libs/dist/libs/grid",
      "@sneat/auth-models": "file:../sneat-libs/dist/libs/auth/models",
      "@sneat/api": "file:../sneat-libs/dist/libs/api",
      "@sneat/logging": "file:../sneat-libs/dist/libs/logging",
      "@sneat/dto": "file:../sneat-libs/dist/libs/dto",
      "@sneat/space-models": "file:../sneat-libs/dist/libs/space/models",
      "@sneat/auth-core": "file:../sneat-libs/dist/libs/auth/core",
      "@sneat/datagrid": "file:../sneat-libs/dist/libs/datagrid",
      "@sneat/contactus-core": "file:../sneat-libs/dist/libs/contactus/core",
      "@sneat/components": "file:../sneat-libs/dist/libs/components",
      "@sneat/auth-ui": "file:../sneat-libs/dist/libs/auth/ui",
      "@sneat/space-services": "file:../sneat-libs/dist/libs/space/services"
    }
  }
}
```

> **Assumes** sneat-libs and sneat-apps repos are sibling directories:
>
> ```
> projects/
>   sneat-libs/
>   sneat-apps/
>   datatug/
> ```

### 5.3 Reinstall after each sneat-libs build

```bash
# In sneat-apps/ (or datatug/)
pnpm install   # picks up updated file: references
```

### 5.4 Switching back to NPM versions

Remove the `pnpm.overrides` block from `package.json` and run `pnpm install`.

---

## 6. Transition sneat-apps to Consume from NPM

Once `@sneat/*` packages are published and stable:

### 6.1 Add packages as dependencies

```bash
# In sneat-apps/
pnpm add @sneat/core @sneat/ui @sneat/data @sneat/grid \
         @sneat/auth-models @sneat/api @sneat/logging @sneat/dto \
         @sneat/space-models @sneat/auth-core @sneat/datagrid \
         @sneat/contactus-core @sneat/components @sneat/auth-ui \
         @sneat/space-services
```

### 6.2 Remove libs from sneat-apps

For each migrated lib:

1. Delete `libs/<path>/` from `sneat-apps`
2. Remove its path alias from `tsconfig.base.json`
3. Remove its Nx project entry (or run `pnx generate @nx/workspace:remove --projectName=<name>`)

### 6.3 Remove pnpm overrides

Delete the `pnpm.overrides` block from `sneat-apps/package.json`.

### 6.4 Verify

```bash
pnx run-many -t build,test,lint --all
```

---

## 7. Verification Checklist

### sneat-libs workspace

- [ ] All 15 libs build without errors: `pnx run-many -t build --all`
- [ ] All tests pass: `pnx run-many -t test --all`
- [ ] No circular dependencies: `pnx graph` shows clean DAG
- [ ] Each lib's `package.json` has correct `peerDependencies`
- [ ] `pnx release --dry-run` produces expected output
- [ ] CI pipeline passes on `main`
- [ ] All 15 packages visible on `npmjs.com/@sneat`

### sneat-apps after transition

- [x] Zero `libs/` directories that belong in sneat-libs remain (Mar 2026)
- [x] Zero path aliases in `tsconfig.base.json` for moved libs (Mar 2026)
- [x] `pnx run-many -t build,test,lint --all` passes (Mar 2026)
- [x] `pnpm ls @sneat/core` shows the NPM version `0.1.4` (not `file:`) (Mar 2026)
- [x] No `@sneat/*` `file:` overrides in `package.json` (Mar 2026)

### sneat-libs publish fix — COMPLETE (v0.1.4)

Root causes fixed in sneat-libs:

- `tsconfig.lib.base.json` — added `"compilationMode": "partial"` (full mode blocked publish with prepublishOnly guard)
- `nx.json` — added `release.publish` executor (`@nx/js:release-publish`) pointing to `dist/{projectRoot}`
- `nx.json` — added `release.version.generatorOptions.packageRoot: "dist/{projectRoot}"`
- `libs/components/ng-package.json` — added `assets: ["src/**/*.scss"]` so SCSS is in dist

v0.1.4 published to NPM with correctly compiled dist output. All 39 sneat-apps projects pass build, test, and lint consuming from NPM.
