# ⚠️ Assetus has a new canonical home: `sneat-co/assetus`

Active Assetus development now happens in the dedicated repository
**[`github.com/sneat-co/assetus`](https://github.com/sneat-co/assetus)** (Go backend
space module + Nx/Angular/Ionic frontend in one repo, mirroring the `listus` layout).

That repo implements the approved **Assetus MVP** — the ownership _system of record_ —
including the asset pages (list + create, detail + edit, remove, transfer + history
timeline) that this `pages` library used to host.

Spec (source of truth):
[`sneat-co/backstage` → `spec/features/assetus-mvp`](https://github.com/sneat-co/backstage/tree/main/spec/features/assetus-mvp).

## Why this code is still here

The MVP in the new repo is a **clean, narrower model** than these legacy `pages`. The
legacy asset/real-estate/asset-group pages here are **deliberately deferred** by the MVP
Feature's _Not Doing_ section and are **not yet ported** to the new repo. To honour
"no functionality lost", this legacy code is **left in place** for now.

## Follow-up before this directory is removed

1. Point the app's space routing at the new Assetus pages (in `sneat-co/assetus` /
   `@sneat/extension-assetus`) or retire the legacy pages.
2. Remove this `libs/extensions/assetus/pages` library and verify
   `pnpm install && nx run-many -t lint test build`.

Until then, **do not build new Assetus pages here** — build them in `sneat-co/assetus`.
