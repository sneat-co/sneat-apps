# DataTug Decoupling Plan — Master Roadmap

> **Goal**: Split the current `sneat-apps` monorepo into 4 independent repositories with
> hard NPM package boundaries. Strong boundaries prevent accidental cross-repo dependencies
> (like the scrumspace↔datatug NavService incident) and minimise per-repo build times.

---

## Target: 4 Repositories

```
sneat-libs/          → publishes @sneat/* packages to public NPM
sneat-apps/          → sneat.app + scrumspace (open source, consumes @sneat/* from NPM)
datatug/             → DataTug workbench (open source, consumes @sneat/* from NPM)
logist/              → commercial app (private repo, consumes @sneat/* from NPM)
```

### Why hard NPM boundaries?

TypeScript can only import from a package's declared public API when it is consumed as
an NPM package — internal paths are invisible. This makes accidental coupling detectable
at install/build time, not just by code review convention.

---

## Current State in `sneat-apps`

### DataTug Projects

| Project | Type | Path |
|---------|------|------|
| `datatug-app` | Angular application | `apps/datatug-app/` |
| `datatug-main` | Buildable library | `libs/datatug/main/` |

### Shared Libs DataTug Depends On (all confirmed necessary)

| Package | sneat-apps path |
|---------|----------------|
| `@sneat/api` | `libs/api` |
| `@sneat/auth-core` | `libs/auth/core` |
| `@sneat/auth-models` | `libs/auth/models` |
| `@sneat/auth-ui` | `libs/auth/ui` |
| `@sneat/components` | `libs/components` |
| `@sneat/contactus-core` | `libs/contactus/core` |
| `@sneat/core` | `libs/core` |
| `@sneat/data` | `libs/data` |
| `@sneat/datagrid` | `libs/datagrid` |
| `@sneat/dto` | `libs/dto` |
| `@sneat/grid` | `libs/grid` |
| `@sneat/logging` | `libs/logging` |
| `@sneat/space-models` | `libs/space/models` |
| `@sneat/space-services` | `libs/space/services` |
| `@sneat/ui` | `libs/ui` |

### External npm Packages Already on NPM

- `@sneat/wormhole` (^0.0.6)
- `@sneat/random` (0.0.4)

---

## Pre-Work: Cross-Dependencies ✅ DONE

Both cross-dependencies between datatug and scrumspace have been resolved:

1. **`scrumspace-dailyscrum` → `datatug-main`** — `ScrumCardComponent` was importing
   `NavService` from `@sneat/datatug-main`. Fixed: `navigateToMember()` added to
   `SpaceNavService` in `@sneat/space-services`; scrumspace updated to use that.

2. **`datatug-main` → `ext-scrumspace-*`** — Two commented-out import lines referencing
   `IRetrospective` and `IScrum`. Fixed: dead imports deleted.

---

## Migration Phases

### Phase 1 — Create `sneat-libs` workspace and publish @sneat/* to NPM

See detailed plan: [sneat-libs.md](sneat-libs.md)

This is the prerequisite for all other phases. Until `@sneat/*` packages are available
on NPM, the other repos cannot be independent.

### Phase 2 — Create `datatug` workspace

See detailed plan: [datatug-workspace.md](datatug-workspace.md) _(to be written after Phase 1)_

```bash
pnpm dlx create-nx-workspace@latest datatug \
  --preset=angular-monorepo \
  --packageManager=pnpm \
  --nxCloud=skip \
  --style=scss
```

- Move `apps/datatug-app/` and `libs/datatug/main/` from `sneat-apps`
- Replace all `@sneat/*` workspace imports with NPM package versions
- `datatug-app` should NOT depend on `@sneat/app` (sneat-specific bootstrap);
  provide its own app initialisation directly using `@sneat/auth-core` etc.
- Wire up Firebase config (own `environment.ts`; same Firebase project initially)

### Phase 3 — Clean up `sneat-apps`

Once `datatug` workspace is verified:

1. Remove `apps/datatug-app/` from `sneat-apps`
2. Remove `libs/datatug/` from `sneat-apps`
3. Remove datatug path aliases from `tsconfig.base.json`
4. Remove shared libs that have moved to `sneat-libs` from `sneat-apps/libs/`
5. Update CI

### Phase 4 — Extract `logist` to private repo

Separate effort, blocked on Phase 1 only (`@sneat/*` on NPM).

---

## Authentication & Firebase

- Auth libs (`@sneat/auth-*`) live in `sneat-libs`, published to NPM
- Initially: all apps share the same Firebase project (simplest)
- `datatug` and `logist` each maintain their own `environment.ts` with Firebase config
- `@sneat/auth-core` accepts Firebase config at bootstrap — not hardcoded in the lib

---

## Open Questions

| # | Question | Needed for |
|---|----------|------------|
| Q1 | Split `datatug-main` into granular libs immediately or later? | Phase 2 scope |
| Q2 | Separate Firebase project for datatug eventually? | Phase 2 env setup |
