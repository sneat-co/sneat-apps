# sneat-libs — Shared Libraries

Shared, domain-agnostic Angular libraries published under the `@sneat/*` npm scope.

**Repository:** [github.com/sneat-co/sneat-libs](https://github.com/sneat-co/sneat-libs)  
**Source:** `/projects/sneat-co/sneat-libs/libs/`

These libraries are consumed by all apps in this monorepo (`sneat-app`, `listus-app`, `debtus-app`) to avoid code duplication. No app-specific or domain-specific code belongs here.

---

## Core Infrastructure

| Package | Source dir | Description |
|---|---|---|
| [`@sneat/api`](https://www.npmjs.com/package/@sneat/api) | [`libs/api`](../../sneat-libs/libs/api) | API communication layer, Firestore service, SneatApiService interface & factory |
| [`@sneat/app`](https://www.npmjs.com/package/@sneat/app) | [`libs/app`](../../sneat-libs/libs/app) | App bootstrap utilities, base app component, standard imports helper |
| [`@sneat/core`](https://www.npmjs.com/package/@sneat/core) | [`libs/core`](../../sneat-libs/libs/core) | Core services, models, and shared utilities |
| [`@sneat/dto`](https://www.npmjs.com/package/@sneat/dto) | [`libs/dto`](../../sneat-libs/libs/dto) | Data transfer objects (DTOs) shared across all layers |
| [`@sneat/data`](https://www.npmjs.com/package/@sneat/data) | [`libs/data`](../../sneat-libs/libs/data) | Base data record types and modification tracking models |
| [`@sneat/logging`](https://www.npmjs.com/package/@sneat/logging) | [`libs/logging`](../../sneat-libs/libs/logging) | Sentry setup, analytics integration, logging module |

---

## Authentication

| Package | Source dir | Description |
|---|---|---|
| [`@sneat/auth-core`](https://www.npmjs.com/package/@sneat/auth-core) | [`libs/auth/core`](../../sneat-libs/libs/auth/core) | Authentication services and core logic |
| [`@sneat/auth-models`](https://www.npmjs.com/package/@sneat/auth-models) | [`libs/auth/models`](../../sneat-libs/libs/auth/models) | Authentication data models and interfaces |
| [`@sneat/auth-ui`](https://www.npmjs.com/package/@sneat/auth-ui) | [`libs/auth/ui`](../../sneat-libs/libs/auth/ui) | Authentication UI components (login, sign-up) |

---

## Space (Workspace)

A "space" is a collaborative workspace (e.g. a family group or team).

| Package | Source dir | Description |
|---|---|---|
| [`@sneat/space-models`](https://www.npmjs.com/package/@sneat/space-models) | [`libs/space/models`](../../sneat-libs/libs/space/models) | Space data models and interfaces |
| [`@sneat/space-services`](https://www.npmjs.com/package/@sneat/space-services) | [`libs/space/services`](../../sneat-libs/libs/space/services) | Space management services |
| [`@sneat/space-components`](https://www.npmjs.com/package/@sneat/space-components) | [`libs/space/components`](../../sneat-libs/libs/space/components) | Shared space UI components |

---

## UI & Components

| Package | Source dir | Description |
|---|---|---|
| [`@sneat/ui`](https://www.npmjs.com/package/@sneat/ui) | [`libs/ui`](../../sneat-libs/libs/ui) | Focus utilities, shared UI components, selector components |
| [`@sneat/components`](https://www.npmjs.com/package/@sneat/components) | [`libs/components`](../../sneat-libs/libs/components) | Reusable Angular components: app-version, pipes, virtual slider, card list, error card |
| [`@sneat/grid`](https://www.npmjs.com/package/@sneat/grid) | [`libs/grid`](../../sneat-libs/libs/grid) | Grid layout models |
| [`@sneat/datagrid`](https://www.npmjs.com/package/@sneat/datagrid) | [`libs/datagrid`](../../sneat-libs/libs/datagrid) | Data grid components and Tabulator integration |
| [`@sneat/wizard`](https://www.npmjs.com/package/@sneat/wizard) | [`libs/wizard`](../../sneat-libs/libs/wizard) | Step-by-step wizard UI component |

---

## Contacts

| Package | Source dir | Description |
|---|---|---|
| [`@sneat/contactus-core`](https://www.npmjs.com/package/@sneat/contactus-core) | [`libs/contactus/core`](../../sneat-libs/libs/contactus/core) | Contact management core services and models |
| [`@sneat/contactus-shared`](https://www.npmjs.com/package/@sneat/contactus-shared) | [`libs/contactus/shared`](../../sneat-libs/libs/contactus/shared) | Shared contact components and pipes |
| [`@sneat/contactus-services`](https://www.npmjs.com/package/@sneat/contactus-services) | [`libs/contactus/services`](../../sneat-libs/libs/contactus/services) | Contact data services |
| [`@sneat/contactus-internal`](https://www.npmjs.com/package/@sneat/contactus-internal) | [`libs/contactus/internal`](../../sneat-libs/libs/contactus/internal) | Internal contact components (non-exported) |

---

## Extension Modules (in sneat-libs)

These extension modules are shared enough to live in `sneat-libs`:

| Package | Source dir | Description |
|---|---|---|
| [`@sneat/mod-assetus-core`](https://www.npmjs.com/package/@sneat/mod-assetus-core) | [`libs/extensions/assetus/core`](../../sneat-libs/libs/extensions/assetus/core) | Asset management core logic |
| [`@sneat/ext-assetus-components`](https://www.npmjs.com/package/@sneat/ext-assetus-components) | [`libs/extensions/assetus/components`](../../sneat-libs/libs/extensions/assetus/components) | Asset management UI components |
| [`@sneat/mod-schedulus-core`](https://www.npmjs.com/package/@sneat/mod-schedulus-core) | [`libs/extensions/schedulus/core`](../../sneat-libs/libs/extensions/schedulus/core) | Scheduling/calendar core logic |
| [`@sneat/extensions-schedulus-shared`](https://www.npmjs.com/package/@sneat/extensions-schedulus-shared) | [`libs/extensions/schedulus/shared`](../../sneat-libs/libs/extensions/schedulus/shared) | Shared scheduling components |
| [`@sneat/extensions-schedulus-main`](https://www.npmjs.com/package/@sneat/extensions-schedulus-main) | [`libs/extensions/schedulus/main`](../../sneat-libs/libs/extensions/schedulus/main) | Schedulus main module |

---

## See Also

- [apps/README.md](apps/README.md) — Apps consuming these libraries
- [apps/PLAN-mini-apps.md](apps/PLAN-mini-apps.md) — Plan for mini-app creation and library extraction
- [ARCHITECTURE.md](ARCHITECTURE.md) — Overall architecture
