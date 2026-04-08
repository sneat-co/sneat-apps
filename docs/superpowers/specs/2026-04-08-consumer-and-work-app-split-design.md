# Consumer and Work App Split — Design

**Date:** 2026-04-08
**Status:** Draft (pending implementation plan)
**Scope:** Introduce a B2B sibling (`sneat.work`) to the existing consumer app (`sneat.app`), and wire a third app (`issue-number-one`) in a separate repo to share the sneat.work Firebase project for authentication.

## Goals

- Ship two Angular apps in the `sneat-apps` Nx workspace: `apps/sneat-app` (consumer, sneat.app) and `apps/sneat-work` (B2B, sneat.work).
- Wire `issue-number-one` (separate repo) to authenticate against the **sneat-work** Firebase project, sharing it with `apps/sneat-work`.
- Keep all three apps on a single shared `@sneat/*` library surface (developed in `sneat-libs`, consumed via the npm registry using pnpm).
- Make Firebase project identity a property of the consuming app, not the library — the library plumbing already supports this; one published constant needs to move out.
- Deploy `sneat-work` to Firebase Hosting using the same `sneat-sites`-based mechanism as `sneat-app`, against the new `sneat-work` Firebase project.

## Non-goals (deferred)

- Per-app branding, theming, or different copy. All three apps look identical for v1; brand divergence is later work.
- Per-app auth provider restrictions (e.g. hiding Telegram from corporate users). All three apps offer the same auth providers.
- Native iOS/Android builds for `sneat-work` or `issue-number-one`. Web-only for v1.
- Extracting any of the sneat-apps `libs/*` (user, space, scrumspace, …) into `sneat-libs` so `issue-number-one` can consume them. `issue-number-one` gets only auth + the standard provider stack in v1.
- Cross-app SSO between sneat.app (consumer) and sneat.work (B2B). They live in different Firebase projects and won't share sessions — that's the intended separation.
- Posthog / Sentry observability for `sneat-work` and `issue-number-one`. `sneat-app` keeps its current tokens.
- Backward compatibility with prior `@sneat/app` consumers — the user is the only consumer at this stage and breaking changes are acceptable.

## Architecture overview

```
sneat-libs (repo)              sneat-apps (repo / Nx workspace)        issue-number-one (repo)
├─ libs/app           ─►       ├─ apps/sneat-app    (sneat.app)   ┐
├─ libs/auth/core    ─►        │   └─ environments/                │   ┌─ src/app
├─ libs/auth/ui      ─►        │       ├─ environment.ts           │   │   ├─ environment.ts
├─ libs/core         ─►        │       └─ environment.prod.ts      ├─► │   └─ environment.prod.ts
└─ libs/...          ─►        └─ apps/sneat-work   (sneat.work)   │   (consumes @sneat/* via pnpm/npm)
                                   └─ environments/...             │
                                                                   │
                                Firebase project A: sneat-eur3-1   (consumer — sneat.app)
                                Firebase project B: sneat-work     (B2B — sneat.work + issue-number-one)
```

**Key idea:** Firebase project identity becomes a property of the consuming app, not the library. `@sneat/app` keeps the plumbing (`getStandardSneatProviders`, emulator base config) but stops exporting consumer-specific Firebase constants. Each of the three apps owns its own `environment.prod.ts` and declares its own `firebaseConfig`. The sneat.work Firebase project is shared between `apps/sneat-work` and `issue-number-one` by declaration, not by code-sharing — they each independently pass the same project's keys to the same `getStandardSneatProviders` API.

## Section 1 — `sneat-libs` refactor (`@sneat/app`)

Stop baking the consumer Firebase project into the library, without breaking the existing `apps/sneat-app` build during the transition.

**File-level changes in `sneat-libs/libs/app/`:**

1. **Delete consumer-specific exports from `src/environments/environment.prod.ts`.** Remove `firebaseConfigForSneatApp` (the `sneat-eur3-1` constant) and `prodEnvironmentConfig`. The whole file is deleted — `@sneat/app` no longer ships a "production env config" because production env is per-app.
2. **Keep `src/environments/environment.base.ts`** with its emulator wiring (`firebaseEmulatorConfig`, `baseEnvironmentConfig`). Genuinely shared dev infrastructure.
3. **Rename `baseEnvironmentConfig` → `emulatorEnvironmentConfig`** for clearer intent: this is the dev/emulator default, not a "base" to extend.
4. **Update `src/index.ts` (public surface)** so `@sneat/app` exports:
   - `getStandardSneatProviders`, `provideAppInfo`, `provideRolesByType` (unchanged)
   - `emulatorEnvironmentConfig`, `firebaseEmulatorConfig` (for local dev)
   - **Removed:** `prodEnvironmentConfig`, `firebaseConfigForSneatApp`
5. **Investigate and likely delete `appSpecificConfig`.** Currently `apps/sneat-app/environments/environment.ts` calls `appSpecificConfig(prodEnvironmentConfig)` and the prod file comments `// TODO: Not sure why we need this`. Read the implementation: if it's a vestigial pass-through, delete it; if it has real logic, keep it but ensure it accepts any `IEnvironmentConfig`.
6. **Bump `@sneat/app` minor version** (e.g. `0.3.0` → `0.4.0`) and publish to npm. All three apps then `pnpm add @sneat/app@0.4.0`.

**What is NOT changing in this section:**

- `getStandardSneatProviders` signature stays the same — it already accepts an `environmentConfig` whose `firebaseConfig` is threaded to `getAngularFireProviders`. The plumbing is correct; only the published constants are moving out.
- `@sneat/auth-ui` `authRoutes` — identical for all apps.
- `@sneat/auth-core` provider list — identical for all apps.

## Section 2 — `apps/sneat-work` in the sneat-apps Nx workspace

Stand up a second Angular app that's a sibling of `apps/sneat-app`, sharing 100% of the code today and diverging gradually as B2B requirements emerge.

**Scaffolding approach: copy, don't generate.** `apps/sneat-app` already has the correct shape (vite, ionic, `@sneat/*` wiring, routing module, environments folder, ionicons registration). Generating fresh via `nx g @nx/angular:app sneat-work` would produce a different baseline that we'd then have to retrofit.

**Files in `apps/sneat-work/` after the copy:**

| File                                                                               | Change from sneat-app                                                                                     |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `project.json`                                                                     | Rename `"name": "sneat-app"` → `"sneat-work"`, update `sourceRoot`, `outputPath`, and any tsconfig paths. |
| `tsconfig.app.json`, `tsconfig.spec.json`, `tsconfig.json`, `tsconfig.editor.json` | Path-only updates if any.                                                                                 |
| `vite.config.mts`                                                                  | Update `cacheDir` / output path references.                                                               |
| `src/index.html`                                                                   | `<title>sneat.work</title>` and any meta tags.                                                            |
| `src/main.ts`                                                                      | One-line change: `provideAppInfo({ appId: 'sneat-work', appTitle: 'sneat.work' })`. Imports unchanged.    |
| `src/app/sneat-app.component.ts` → `src/app/sneat-work.component.ts`               | Rename file + class + selector (`sneat-work-root`).                                                       |
| `src/app/sneat-app-routing.module.ts` → `src/app/sneat-work-routing.module.ts`     | Rename file; routes identical for now.                                                                    |
| `src/environments/environment.ts`                                                  | New env import; calls `getStandardSneatProviders` with the work Firebase config (see below).              |
| `src/environments/environment.prod.ts`                                             | Same shape as above, prod variant. **Contains the sneat-work Firebase project keys.**                     |
| `src/register-ionicons.ts`                                                         | Identical (copy as-is).                                                                                   |
| `src/styles.scss`, `src/assets/`                                                   | Identical for now; brand divergence deferred.                                                             |

**What stays shared (zero changes):**

- All `libs/*` in this workspace (`user`, `space`, `scrumspace`, `meeting`, `extensions/*`, etc.).
- All published `@sneat/*` packages.
- Auth routes via `authRoutes` from `@sneat/auth-ui` — both apps register the exact same routes.
- Firebase rules / functions — those live in their respective Firebase projects.

**Environment file shape (new pattern, applies to both apps):**

```ts
// apps/sneat-app/src/environments/environment.prod.ts
import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';

const firebaseConfig: IFirebaseConfig = {
  projectId: 'sneat-eur3-1',
  appId: '1:588648831063:web:303af7e0c5f8a7b10d6b12',
  apiKey: 'AIzaSyCeQu1WC182yD0VHrRm4nHUxVf27fY-MLQ',
  authDomain: 'sneat.app',
  messagingSenderId: '588648831063',
  measurementId: 'G-TYBDTV738R',
};

export const sneatAppEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig,
  posthog: {
    /* existing token, unchanged */
  },
  sentry: {
    /* existing dsn, unchanged */
  },
};
```

`apps/sneat-work/src/environments/environment.prod.ts` is the same shape but with:

- `firebaseConfig.projectId: 'sneat-work'`
- `apiKey`, `appId`, `authDomain` (= `sneat.work`), `messagingSenderId`, `measurementId` from the sneat-work Firebase web app config
- **No** `posthog` or `sentry` blocks (deferred)

The exported binding is `sneatWorkEnvironmentConfig` to avoid name collision with the consumer app.

**Nx targets:** `nx serve sneat-work` / `nx build sneat-work` / `nx test sneat-work` / `nx lint sneat-work` work automatically once `project.json` is renamed. `nx affected` correctly tracks both apps against the shared libs.

## Section 3 — Wiring `issue-number-one` to consume `@sneat/*`

Turn the bare scaffolded in1app into a real Angular app that uses the sneat-work Firebase project for auth, by consuming the same published `@sneat/*` packages.

**Repo-level setup (`/Users/alexandertrakhimenok/projects/sneat-co/issue-number-one`):**

1. **Add dependencies via `pnpm add`** in this repo: `@sneat/app`, `@sneat/auth-core`, `@sneat/auth-ui`, `@sneat/core`, `@angular/fire`, `firebase`, `@ionic/angular`, `ionicons`, `@capacitor/core`. The Capacitor core dep is a transitive runtime requirement of `@sneat/app`'s `init-firebase.ts`, even for web-only builds — it detects non-native and behaves correctly. Match Angular version `~21.2.0` which both repos are already on.
2. **Add an `environments/` folder** under `src/` mirroring the sneat-apps pattern: `environment.ts`, `environment.prod.ts`. Both export an `IEnvironmentConfig` whose `firebaseConfig` is the **sneat-work** project (same keys as `apps/sneat-work/`'s env). No posthog/sentry.
3. **Configure file replacement** in `project.json`'s `build.configurations.production` so `environment.ts` → `environment.prod.ts` at prod build time (matches the sneat-app pattern).

**App-level wiring (`src/app/app.config.ts`):**

Replace the current bare `app.config.ts` with the sneat-app pattern, adapted for the in1app standalone-bootstrap style:

```ts
// src/app/app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getStandardSneatProviders, provideAppInfo, provideRolesByType } from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { in1AppEnvironmentConfig } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), ...getStandardSneatProviders(in1AppEnvironmentConfig), provideAppInfo({ appId: 'in1app', appTitle: 'issue-number-one' }), provideRolesByType(undefined), provideRouter([...appRoutes, ...authRoutes])],
};
```

in1app uses Angular's `bootstrapApplication(App, appConfig)` style (modern standalone), while sneat-apps does `bootstrapApplication(SneatAppComponent, { providers: [...] })` directly in `main.ts`. Both work; in1app's pattern is the newer Angular CLI default and we keep it as-is.

**Routing:** Keep whatever in1app routes already exist (currently effectively just the `nx-welcome` placeholder). The spread `[...appRoutes, ...authRoutes]` in `appConfig` adds the sneat auth screens at whatever paths `@sneat/auth-ui` defines them.

**What in1app does NOT get from sneat-apps:**

- It does **not** import from `libs/*` of the sneat-apps workspace — different repo, can't. Anything domain-specific (`@sneat/space`, `@sneat/user`, `@sneat/scrumspace`) would need to be either extracted into `sneat-libs` and published, or re-implemented in in1app. For v1, **only auth + the basic provider stack are shared**.
- No Ionic UI imports are required just to get auth working — but `@sneat/app`'s `getStandardSneatProviders` calls `provideIonicAngular()`, which means `@ionic/angular` must be installed even if you don't render Ionic components. Acceptable cost of reusing the provider bundle as-is. Splitting it (a `getMinimalSneatProviders`) is deferred unless bundle size becomes painful.

**Firebase config duplication:** The sneat-work `firebaseConfig` literal appears in two places — `sneat-apps/apps/sneat-work/src/environments/environment.prod.ts` and `issue-number-one/src/environments/environment.prod.ts`. This is intentional: the apps live in different repos and Firebase web config keys are public anyway (security rules are what matter). Don't DRY this up via a shared package; that would create coupling for ~10 lines of constants.

## Section 4 — Migration order, Firebase setup, and risks

### Prerequisites already done

- The **sneat-work** Firebase project has been created in the Firebase console with `projectId: sneat-work`.

### Prerequisites still required (out-of-band, before code merges)

- In the sneat-work Firebase project: enable **Authentication** with the same providers as sneat-eur3-1 (Google, email, etc.). Enable **Firestore** in the same region (eur3) for parity.
- Add a web app to the sneat-work project to obtain `apiKey`, `appId`, `authDomain`, `messagingSenderId`, `measurementId`. Record these for the env files.
- Add **`sneat.work`**, **`localhost`**, and (if hosted on its own domain) the in1app domain to the sneat-work project's Authorized domains list.
- Create a Firebase Hosting site in the sneat-work project (`firebase hosting:sites:create sneat-work` or via console). Connect the custom domain `sneat.work` to that site (DNS, ownership verification — out of scope for code).

### Implementation order

**Step 1 — `sneat-libs` refactor (must ship first).**

- In `libs/app/src/environments/`: delete `environment.prod.ts`, rename `baseEnvironmentConfig` → `emulatorEnvironmentConfig` in `environment.base.ts`, and update all internal imports inside `sneat-libs` that reference the deleted symbols.
- Investigate `appSpecificConfig`; delete if vestigial.
- Update `libs/app/src/index.ts` public surface.
- Build and test `sneat-libs` locally (`pnpm nx build app`).
- Bump `@sneat/app` version (`0.3.0` → `0.4.0`), publish to npm.

**Step 2 — `sneat-apps/apps/sneat-app` updates.**

- `pnpm add @sneat/app@0.4.0` (and any peer bumps).
- Rewrite `apps/sneat-app/src/environments/environment.ts` and `environment.prod.ts` to inline the `firebaseConfig` literal (the existing `sneat-eur3-1` keys) and stop importing `prodEnvironmentConfig` / `appSpecificConfig`.
- `pnpm nx build sneat-app` and `pnpm nx serve sneat-app` to verify nothing regressed. **At this point sneat.app behaves identically to before** — same Firebase project, same code paths.
- Commit. **This is a safe checkpoint** even if work pauses here.

**Step 3 — `sneat-apps/apps/sneat-work` scaffolding.**

- Copy `apps/sneat-app/` → `apps/sneat-work/` and apply the file edits from Section 2.
- Drop the sneat-work `firebaseConfig` literal into both env files.
- `pnpm nx serve sneat-work` — verify it loads on its dev port and the auth flow lands on the sneat-work Firebase project (sign in, see a user document/UID created in the right project).
- Commit.

**Step 4 — `issue-number-one` wiring.**

- `pnpm add` the dependencies listed in Section 3.
- Add `src/environments/` with the sneat-work `firebaseConfig`.
- Rewrite `src/app/app.config.ts` per Section 3.
- Update `project.json` for the file replacement.
- `pnpm nx serve` — verify auth works and a user signing in here produces the same UID as the same user signing into sneat-work.
- Commit.

**Step 5 — Firebase Hosting wiring for sneat-work** (Section 5 below).

### Risks and mitigations

| Risk                                                                                                                                       | Mitigation                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Step 1 ships a broken `@sneat/app` and breaks `apps/sneat-app` mid-refactor.                                                               | Step 1 is buildable and testable inside `sneat-libs` before publishing. We don't publish until `pnpm nx build app` is green. Worst case: yank the version.                                                                                                                                                                 |
| `appSpecificConfig` turns out to do something load-bearing.                                                                                | Step 1 includes "investigate and decide" — read it before deleting. If non-trivial, it stays and gets passed an arbitrary `IEnvironmentConfig`.                                                                                                                                                                            |
| Vite cache or Nx project graph doesn't pick up the new `sneat-work` app cleanly.                                                           | `pnpm nx reset` after the copy. Verify with `pnpm nx show projects`.                                                                                                                                                                                                                                                       |
| AngularFire singleton conflicts when in1app and sneat-work talk to the same Firebase project — e.g. signing into one auto-signs the other. | This is **expected and desired** — same project = same auth domain = SSO via cookies on `sneat.work`. It is the feature, not a bug.                                                                                                                                                                                        |
| sneat-eur3-1 (consumer) and sneat-work users get conflated in error logs.                                                                  | Posthog and Sentry have separate tokens per app. sneat-app keeps its current tokens; sneat-work and in1app start without tokens.                                                                                                                                                                                           |
| Firebase emulator wiring breaks when env files no longer extend the renamed `emulatorEnvironmentConfig`.                                   | Local-dev `environment.ts` (non-prod) for each app explicitly imports `emulatorEnvironmentConfig` from `@sneat/app` and merges it: `{ ...emulatorEnvironmentConfig, firebaseConfig: { ...emulatorEnvironmentConfig.firebaseConfig, projectId: 'demo-sneat-work' } }`. The implementation plan will spell this out per app. |

## Section 5 — Deploying sneat-work to Firebase Hosting

Replicate the sneat-app deploy pattern for sneat-work, targeting the new sneat-work Firebase project.

### Existing sneat-app deploy mechanism (for reference)

Deployment is **manual**, driven by `sneat-devops/deploy-pwa.ps1`:

1. Builds in `sneat-apps`: `pnpm nx build sneat-app --base-href=/pwa/`
2. Copies `sneat-apps/dist/apps/sneat-app/` → `sneat-sites/websites/sneat.app/pwa/`
3. Rewrites the index.html `<base href>` to `/pwa/`
4. From `sneat-sites/`, runs `firebase deploy --only hosting:<target>` against the **sneat-eur3-1** Firebase project (implicit default from `.firebaserc`)

The hosting setup lives in **`sneat-sites`** repo (`firebase.json` + `.firebaserc`), with the Angular app served as `/pwa/*` under a static landing site at `websites/sneat.app/`. There is no CI deploy workflow.

### Changes in `sneat-sites` repo

1. **Create `websites/sneat.work/`** as a sibling of `websites/sneat.app/`. Copy `websites/sneat.app/index.html` (and any siblings) verbatim, then replace every `sneat.app` literal with `sneat.work` (including `<title>`, meta tags, og:tags, links). The `pwa/` subfolder will be filled by the deploy script.
2. **Add a hosting target in `sneat-sites/firebase.json`** for sneat-work:
   ```json
   {
     "target": "sneat-work",
     "public": "websites/sneat.work",
     "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
     "rewrites": [{ "source": "/pwa/**", "destination": "/pwa/index.html" }]
   }
   ```
3. **Update `sneat-sites/.firebaserc`**:
   - Add the sneat-work Firebase project as a named alias under `projects`: `"sneat-work": "sneat-work"`.
   - Add a `targets` block for the sneat-work project, mapping the `sneat-work` target to the sneat-work Hosting site name. Example structure:
     ```json
     "targets": {
       "sneat-eur3-1": { "hosting": { "togethered": ["togethered"] } },
       "sneat-work":   { "hosting": { "sneat-work":  ["sneat-work"]  } }
     }
     ```
   - The exact site name in the inner array must match what the Firebase console / `firebase hosting:sites:create` produced.

### Changes in `sneat-devops`

4. **Update `deploy-pwa.ps1`** to accept a third parameter `$project` and pass `--project $project` through to the `firebase deploy` command. Backward compatible with sneat-app if `$project` defaults to the current implicit behavior, or required if we prefer explicitness for safety.
5. **Add `scripts/deploy2prod-work.sh`** in `sneat-apps` mirroring the existing `scripts/deploy2prod.sh`, calling the devops script with sneat-work parameters: `app_name=sneat-work`, `hosting=sneat-work`, `project=sneat-work`. Trivial wrapper.

### Order

Section 5 work is **last** — after Steps 1–4 of Section 4. None of this is needed until sneat-work is buildable locally and a real hosted URL is wanted. Steps 1–4 all validate against `localhost` and the live Firebase project's auth.

### Deploy-specific risks

| Risk                                                                          | Mitigation                                                                                                                                                  |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deploying with the wrong `--project` flag silently overwrites the wrong site. | The new deploy script requires `$project` as a positional arg and echoes it before running `firebase deploy`. No defaults in the new sneat-work invocation. |
| `firebase use` global state pollutes deploys.                                 | Use `--project` flag explicitly on every deploy command, never rely on `firebase use`.                                                                      |
| Custom domain `sneat.work` not yet verified when first deploy runs.           | First deploy will succeed and be reachable on the Firebase-assigned `*.web.app` URL; custom domain can be added asynchronously.                             |

## Open items to resolve at implementation time

- Exact `apiKey`, `appId`, `authDomain`, `messagingSenderId`, `measurementId` from the sneat-work Firebase web app config — needed for `apps/sneat-work` and `issue-number-one` env files. (`projectId` is `sneat-work`.)
- The exact Firebase Hosting **site name** created in the sneat-work project — needed for the inner array in `sneat-sites/.firebaserc`'s `targets` block.
- Disposition of `appSpecificConfig` after reading its source: delete or keep.
