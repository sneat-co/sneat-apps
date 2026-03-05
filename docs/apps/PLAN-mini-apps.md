# Plan: Creating listus-app and debtus-app

This document outlines the plan for creating the `listus-app` and `debtus-app` standalone mini-apps, and identifies domain-agnostic code in `sneat-apps` that should be moved to [`sneat-libs`](../sneat-libs.md) first so it can be shared without duplication.

## Guiding Principle

> **Only domain-agnostic, reusable code belongs in `sneat-libs`.**  
> Extension libs (`@sneat/extensions-listus`, `@sneat/ext-debtus-*`) are domain-specific and stay in `sneat-apps`.  
> Mini-apps are thin Angular app shells that load the relevant extension module as their home page.

---

## Phase 1 — Move Shared Code to sneat-libs

These libraries currently live in `sneat-apps` but are domain-agnostic and will be needed by both the super app and the mini-apps. They should be moved to [`sneat-libs`](https://github.com/sneat-co/sneat-libs) and published as `@sneat/*` packages before the mini-apps are created.

### Candidates for extraction

| Library | Current location | Proposed package | Reason |
|---|---|---|---|
| `datetime` | `libs/datetime` | `@sneat/datetime` | Pure date/time pipes, no domain logic. Already named `@sneat/datetime` locally — just needs publishing. |
| `user` (pages) | `libs/user` | `@sneat/user-pages` | User profile page is needed by every app. Domain-agnostic (not listus/debtus specific). |
| `space/pages` | `libs/space/pages` | `@sneat/space-pages` | Space navigation pages (spaces list, space page, invite) are infrastructure needed by any multi-space app. |
| `communes/ui` | `libs/communes/ui` | `@sneat/communes-ui` | Commune/group creation wizard UI. Evaluate if mini-apps need this — move only if so. |
| `testing` | `libs/testing` | `@sneat/testing` | Test setup helpers are dev-time utilities shared across all projects. |

### Not to move

| Library | Reason to stay |
|---|---|
| `extensions/listus` | Listus-specific domain code |
| `extensions/debtus/*` | Debtus-specific domain code |
| `scrumspace/*` | Work app (scrumspace) specific |
| `meeting` | Meeting/timer feature, work app specific |
| `timer` | Tied to meeting/scrumspace |

### Steps for each extraction

1. Move source from `sneat-apps/libs/{name}` → `sneat-libs/libs/{name}`
2. Add/verify `package.json` with correct `@sneat/` name
3. Publish to npm
4. Replace local path reference in `sneat-apps/tsconfig.base.json` with the npm package
5. Verify build passes

---

## Phase 2 — Create listus-app

### Goal

A standalone Angular + Ionic app whose home page is the **Lists module** (`@sneat/extensions-listus`).

### App shell structure

```
apps/listus-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Thin shell, loads ListusModule as root
│   │   ├── app.routes.ts          # Routes: / → listus home, /login, /space/...
│   │   └── app.config.ts          # Firebase, auth, space providers
│   ├── environments/
│   ├── index.html
│   └── main.ts
├── project.json
└── capacitor.config.ts            # If shipping as mobile app
```

### Dependencies

From `sneat-libs` (npm packages):
- `@sneat/app`, `@sneat/auth-core`, `@sneat/auth-ui`
- `@sneat/core`, `@sneat/api`, `@sneat/dto`, `@sneat/logging`
- `@sneat/space-models`, `@sneat/space-services`, `@sneat/space-components`
- `@sneat/space-pages` _(after Phase 1 extraction)_
- `@sneat/user-pages` _(after Phase 1 extraction)_
- `@sneat/contactus-*`
- `@sneat/ui`, `@sneat/components`

From `sneat-apps` (workspace libs):
- `@sneat/extensions-listus` (`libs/extensions/listus`)

### Tasks

- [ ] Run `pnpm nx g @nx/angular:app listus-app` with same options as `sneat-app`
- [ ] Configure Firebase providers (same project or separate)
- [ ] Wire `@sneat/extensions-listus` as the default/home route
- [ ] Add auth guard and login route
- [ ] Add space selection flow (redirect to space → lists)
- [ ] Configure Capacitor for iOS/Android if needed
- [ ] Add CI build target

---

## Phase 3 — Create debtus-app

### Goal

A standalone Angular + Ionic app whose home page is the **Debts module** (`@sneat/ext-debtus-*`).

### App shell structure

```
apps/debtus-app/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Thin shell, loads DebtusModule as root
│   │   ├── app.routes.ts          # Routes: / → debtus home, /login, /space/...
│   │   └── app.config.ts
│   ├── environments/
│   ├── index.html
│   └── main.ts
├── project.json
└── capacitor.config.ts
```

### Dependencies

Same infrastructure as listus-app, but with debtus-specific libs:
- `@sneat/ext-debtus-shared` (`libs/extensions/debtus/shared`)
- `@sneat/ext-debtus-internal` (`libs/extensions/debtus/internal`)

### Tasks

- [ ] Run `pnpm nx g @nx/angular:app debtus-app`
- [ ] Configure Firebase providers
- [ ] Wire debtus extension as the home route
- [ ] Add auth guard, login, space selection flow
- [ ] Configure Capacitor if needed
- [ ] Add CI build target

---

## Phase 4 — Shared Navigation Pattern

Both mini-apps and sneat-app share the same deep-link structure for their respective modules. Document and enforce the URL scheme so links from sneat-app work in mini-apps:

```
/space/:spaceId/lists/...    →  listus-app or sneat-app
/space/:spaceId/debtus/...   →  debtus-app or sneat-app
```

---

## See Also

- [sneat-app.md](sneat-app.md) — Super app
- [listus-app.md](listus-app.md) — Listus mini-app overview
- [debtus-app.md](debtus-app.md) — Debtus mini-app overview
- [../sneat-libs.md](../sneat-libs.md) — Shared library reference
