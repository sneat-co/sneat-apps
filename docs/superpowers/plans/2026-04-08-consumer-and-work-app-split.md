# Consumer and Work App Split — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `apps/sneat-work` (B2B sibling of `apps/sneat-app`), wire `issue-number-one` to authenticate against the new sneat-work Firebase project, and deploy sneat-work to Firebase Hosting using the existing sneat-sites mechanism.

**Architecture:** Move the consumer-specific Firebase config out of `@sneat/app` (one published constant deletion + version bump). Each of three apps then declares its own `firebaseConfig` literal in its own `environment.prod.ts` and passes it to the existing `getStandardSneatProviders(envConfig)` API. The sneat-work Firebase project is shared between `apps/sneat-work` and `issue-number-one` by declaration, not by code-sharing.

**Tech Stack:** Angular 21.2, Nx 22.6, pnpm, Vite, Ionic standalone, AngularFire, Firebase (Auth + Firestore), `@sneat/app`/`@sneat/auth-ui`/`@sneat/auth-core`/`@sneat/core` from npm, Firebase Hosting.

**Spec:** `sneat-apps/docs/superpowers/specs/2026-04-08-consumer-and-work-app-split-design.md`

**Repos involved (all under `/Users/alexandertrakhimenok/projects/sneat-co/`):**

- `sneat-libs` — source of `@sneat/*` packages (publishes to npm)
- `sneat-apps` — Nx workspace, hosts `apps/sneat-app` and (new) `apps/sneat-work`
- `issue-number-one` — separate Nx workspace, single Angular app
- `sneat-sites` — Firebase Hosting config + landing pages
- `sneat-devops` — deploy scripts (`deploy-pwa.ps1`)

**Execution context — all decisions locked in before execution:**

This plan is **fully runnable without human intervention**. All input values have been collected and are hardcoded into the relevant tasks. Run end-to-end on any machine with git/pnpm/node/firebase-cli installed and the repos cloned under a common parent directory.

**User-supplied answers (recorded 2026-04-08):**

1. **Branching:** work directly on `main` in all 5 repos, commit in place (no feature branches, no worktrees).
2. **npm publish gate:** execute autonomously (`pnpm nx release` — no hard pause).
3. **Firebase Hosting deploy gate:** execute autonomously (no hard pause).
4. **sneat-work Firebase web app config:**
   ```
   apiKey:            "AIzaSyB2566A1kaT7H2qXSFHwBLcvmw7-nowp78"
   authDomain:        "sneat-work.firebaseapp.com"
   projectId:         "sneat-work"
   storageBucket:     "sneat-work.firebasestorage.app"
   messagingSenderId: "125224789205"
   appId:             "1:125224789205:web:d9fdf66322b9a871a5ae5c"
   measurementId:     "G-3KWL5H12LW"
   ```
5. **sneat-work Hosting site name:** `sneat-work` (the default site created with the Firebase project).
6. **Lib version strategy:** **all `@sneat/*` libs bump together** to the same version. Current state: all 26 publishable libs in `sneat-libs/libs/` are at `0.3.0`. Target: `0.4.0`. Mechanism: `pnpm nx release version 0.4.0 && pnpm nx release publish`. This bumps every lib (not just `@sneat/app`) and publishes them together. Only `@sneat/app` has actual code changes; the others get version-only bumps.

**Resolved spec open items (decided during plan writing):**

- `appSpecificConfig` (in `sneat-libs/libs/app/src/lib/init-helpers.ts`) is **load-bearing** — it adds the `demo-` prefix to `projectId` and swaps `apiKey` for the emulator placeholder when `firebaseConfig.emulator` is set. **Keep it.** Consuming apps continue calling it.
- sneat-work Firebase web app keys → see answer 4 above.
- sneat-work Hosting site name → see answer 5 above.

---

## Phases

- **Phase A** — Refactor `sneat-libs/libs/app`, publish `@sneat/app@0.4.0`
- **Phase B** — Update `apps/sneat-app` to consume `@sneat/app@0.4.0` (no behavior change)
- **Phase C** — Scaffold `apps/sneat-work` by copying `apps/sneat-app`
- **Phase D** — Wire `issue-number-one` to `@sneat/*` and the sneat-work Firebase project
- **Phase E** — Deploy sneat-work to Firebase Hosting

Each phase ends in a green build and a commit. Phase A blocks B; B blocks C; C and D can in principle run in parallel but the plan keeps them sequential for clarity. Phase E is last.

---

## Phase A — `sneat-libs/libs/app` refactor

Goal: stop publishing the consumer Firebase project as part of the library; rename `baseEnvironmentConfig` to `emulatorEnvironmentConfig`; ship `@sneat/app@0.4.0`.

**Working directory for Phase A:** `/Users/alexandertrakhimenok/projects/sneat-co/sneat-libs`

### Task A1: Verify the lib builds before any changes

**Files:** none (read-only verification)

- [ ] **Step 1: Check current state**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-libs
git status
```

Expected: clean working tree. If not, stop and resolve.

- [ ] **Step 2: Build the lib unchanged**

```bash
pnpm nx build app
```

Expected: PASS, output in `dist/libs/app`. If this fails, stop — we have a pre-existing breakage and the plan's verification baseline is invalid.

- [ ] **Step 3: Note the current published version**

```bash
cat libs/app/package.json | grep version
```

Expected: `"version": "0.3.0"` (per plan-time inspection). Record whatever is actually shown — we'll bump from there.

### Task A2: Rename `baseEnvironmentConfig` → `emulatorEnvironmentConfig` in `environment.base.ts`

**Files:**

- Modify: `libs/app/src/environments/environment.base.ts`

- [ ] **Step 1: Edit the file**

In `libs/app/src/environments/environment.base.ts`, rename the exported binding `baseEnvironmentConfig` to `emulatorEnvironmentConfig`. The file body otherwise stays identical. Final file:

```ts
import { IEnvironmentConfig, IFirebaseConfig, IFirebaseEmulatorConfig } from '@sneat/core';

const useNgrok = window.location.hostname.includes('.ngrok.');
const useSSL = useNgrok || window.location.hostname == 'local-app.sneat.ws';

const nonSecureEmulatorHost = '127.0.0.1';

export const firebaseEmulatorConfig: IFirebaseEmulatorConfig = {
  authPort: useSSL ? 443 : 9099,
  authHost: useNgrok ? window.location.hostname : useSSL ? 'local-fb-auth.sneat.ws' : nonSecureEmulatorHost,
  firestorePort: useSSL ? 443 : 8080,
  firestoreHost: useNgrok ? window.location.hostname : useSSL ? 'local-firestore.sneat.ws' : nonSecureEmulatorHost,
};

export const notNeededForEmulator = 'not-needed-for-emulator';

const firebaseConfig: IFirebaseConfig = {
  emulator: firebaseEmulatorConfig,
  apiKey: notNeededForEmulator,
  authDomain: 'sneat.app',
  projectId: 'local-sneat-app',
  appId: notNeededForEmulator,
  measurementId: 'G-PROVIDE_IF_NEEDED',
};

export const emulatorEnvironmentConfig: IEnvironmentConfig = {
  production: false,
  useNgrok,
  agents: {},
  firebaseConfig,
};
```

- [ ] **Step 2: Verify build is now broken in a controlled way**

```bash
pnpm nx build app
```

Expected: FAIL with TypeScript errors about `baseEnvironmentConfig` not exported, in five files: `environment.ts`, `environment.ci.ts`, `environment.e2e.ts`, `environment.local.ts`, `environments/index.ts`. We'll fix each in the next tasks.

### Task A3: Update internal sibling files in `libs/app/src/environments/` to use the new name

**Files:**

- Modify: `libs/app/src/environments/environment.ts`
- Modify: `libs/app/src/environments/environment.ci.ts`
- Modify: `libs/app/src/environments/environment.e2e.ts`
- Modify: `libs/app/src/environments/environment.local.ts`
- Modify: `libs/app/src/environments/index.ts`

- [ ] **Step 1: Edit `environment.ts`**

```ts
import { IEnvironmentConfig } from '../lib/environment-config';
import { emulatorEnvironmentConfig } from './environment.base';

export const environmentConfig: IEnvironmentConfig = {
  ...emulatorEnvironmentConfig,
};
```

- [ ] **Step 2: Edit `environment.ci.ts`**

```ts
import { IEnvironmentConfig } from '../lib/environment-config';
import { emulatorEnvironmentConfig } from './environment.base';

const useEmulators = true;

export const environmentConfig: IEnvironmentConfig = {
  ...emulatorEnvironmentConfig,
  useEmulators,
};
```

- [ ] **Step 3: Edit `environment.e2e.ts`**

```ts
import { IEnvironmentConfig } from '../lib/environment-config';
import { emulatorEnvironmentConfig } from './environment.base';

export const environmentConfig: IEnvironmentConfig = {
  ...emulatorEnvironmentConfig,
};
```

- [ ] **Step 4: Edit `environment.local.ts`**

```ts
import { IEnvironmentConfig } from '@sneat/core';
import { emulatorEnvironmentConfig } from './environment.base';

export const environmentConfig: IEnvironmentConfig = {
  ...emulatorEnvironmentConfig,
};
```

- [ ] **Step 5: Edit `environments/index.ts`**

Replace the single line:

```ts
export { emulatorEnvironmentConfig } from './environment.base';
```

(Was: `export { baseEnvironmentConfig } from './environment.base';`.)

- [ ] **Step 6: Build**

```bash
pnpm nx build app
```

Expected: still FAIL, but now only because `environment.prod.ts` (which we haven't deleted yet) and `src/index.ts` (which re-exports from it) still reference `firebaseConfigForSneatApp` and `prodEnvironmentConfig`. The five rename errors should be gone.

### Task A4: Delete `environment.prod.ts` and remove its public export

**Files:**

- Delete: `libs/app/src/environments/environment.prod.ts`
- Modify: `libs/app/src/index.ts`

- [ ] **Step 1: Delete the file**

```bash
rm libs/app/src/environments/environment.prod.ts
```

- [ ] **Step 2: Edit `libs/app/src/index.ts` — remove the prod re-export line**

Open `libs/app/src/index.ts`. Delete the line:

```ts
export * from './environments/environment.prod';
```

Leave all other re-exports intact. Final file:

```ts
export * from './environments';
export * from './lib/base-app.component';
export * from './lib/sneat-base-app';
export * from './lib/get-standard-sneat-imports';
export * from './lib/app-component.service';
export * from './environments/environment.local';
export * from './lib/init-firebase';
export * from './lib/init-helpers';
export * from './lib/contact-extensions';
export * from './lib/get-standard-sneat-providers';
export * from './lib/app-specific-providers';
export * from './lib/capacitator-http.service';
```

- [ ] **Step 3: Build**

```bash
pnpm nx build app
```

Expected: PASS. The lib now compiles without `prodEnvironmentConfig` / `firebaseConfigForSneatApp`. If any other file inside `sneat-libs/libs/` still imports those symbols, the build will surface them; fix each by inlining a literal `IFirebaseConfig` or removing the import — but at plan-writing time `grep -rn` showed no internal references, so this should be clean.

- [ ] **Step 4: Confirm `appSpecificConfig` is still exported**

```bash
grep -n "appSpecificConfig" libs/app/src/lib/init-helpers.ts dist/libs/app/lib/init-helpers.d.ts 2>/dev/null
```

Expected: function is defined in `init-helpers.ts` and re-exported via `src/index.ts`'s `export * from './lib/init-helpers';`. We are NOT deleting it — it handles emulator `demo-` prefix and is still needed by all consumer apps.

### Task A5: Commit the code refactor

**Files:** all files modified in A2–A4

- [ ] **Step 1: Stage and commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-libs
git add libs/app/src/environments/environment.base.ts \
        libs/app/src/environments/environment.ts \
        libs/app/src/environments/environment.ci.ts \
        libs/app/src/environments/environment.e2e.ts \
        libs/app/src/environments/environment.local.ts \
        libs/app/src/environments/index.ts \
        libs/app/src/index.ts
git rm libs/app/src/environments/environment.prod.ts
git commit -m "refactor(app)!: remove consumer-specific prod env, rename base→emulator config

BREAKING CHANGE: @sneat/app no longer exports prodEnvironmentConfig or
firebaseConfigForSneatApp. Each consuming app must declare its own
IEnvironmentConfig with its own firebaseConfig. baseEnvironmentConfig
renamed to emulatorEnvironmentConfig for clarity."
```

Note: we do **not** bump `libs/app/package.json` manually — `nx release version` in Task A6 handles version bumps for all publishable libs together.

- [ ] **Step 2: Verify**

```bash
git log --oneline -1
git status
```

Expected: one new commit, clean working tree.

### Task A6: Bump all libs to 0.4.0 via `nx release version`

**Files:**

- Modify (automated by nx): every `libs/**/package.json` currently at 0.3.0 → 0.4.0
- Possibly create/update: `CHANGELOG.md` at workspace root
- Creates a new commit automatically (nx.json has `"release.git.commit": true`)

- [ ] **Step 1: Run version bump**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-libs
pnpm nx release version 0.4.0
```

Expected: prompts may appear depending on `nx release` version; accept defaults. Output lists every project being bumped from `0.3.0` → `0.4.0` (26 libs at plan time). Creates a commit like `chore(release): publish 0.4.0` containing all `package.json` bumps and any changelog changes. Does NOT push yet.

- [ ] **Step 2: Verify**

```bash
git log --oneline -2
grep -rh '"version"' libs/*/package.json libs/*/*/package.json 2>/dev/null | sort -u
```

Expected: two new commits total (the refactor commit from A5 + the `chore(release)` commit from nx). All lib versions show `"version": "0.4.0"`.

- [ ] **Step 3: Push to origin**

```bash
git push origin main
```

Expected: push succeeds. If `nx release` was configured to auto-push (`"release.git.push": true` in `nx.json`) and already pushed in Step 1, this is a no-op.

### Task A7: Publish all libs to npm via `nx release publish`

**Files:** none

- [ ] **Step 1: Build all publishable libs first**

`nx release publish` depends on built artifacts in `dist/libs/*`. Ensure a clean full build:

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-libs
pnpm nx run-many -t build
```

Expected: all libs build to `dist/libs/*` with `package.json` showing `"version": "0.4.0"`.

- [ ] **Step 2: Publish**

```bash
pnpm nx release publish
```

Expected: every publishable project under `libs/` is published to npm at `0.4.0`. If 2FA is enabled on the npm account, this will prompt for an OTP — respond to it and continue. If any lib is already at `0.4.0` on npm (e.g. re-running after a partial failure), `npm publish` will exit with `403 version already exists` for that lib; that is a harmless skip for re-runs.

- [ ] **Step 3: Verify on npm**

```bash
npm view @sneat/app@0.4.0 version
npm view @sneat/auth-ui@0.4.0 version
npm view @sneat/auth-core@0.4.0 version
npm view @sneat/core@0.4.0 version
```

Expected: all four print `0.4.0`. May take 30–60 seconds to propagate after publish.

---

## Phase B — `apps/sneat-app` consumes `@sneat/app@0.4.0`

Goal: bump the dep, rewrite the two env files to inline the existing `sneat-eur3-1` Firebase config, verify behavior is unchanged. **This is a safe checkpoint** — if we stop here, sneat-app is still working.

**Working directory for Phase B:** `/Users/alexandertrakhimenok/projects/sneat-co/sneat-apps`

### Task B1: Bump all `@sneat/*` deps to 0.4.0

**Files:**

- Modify: `package.json` (root of `sneat-apps`)
- Modify: `pnpm-lock.yaml`

At plan time `sneat-apps/package.json` has ~28 `@sneat/*` deps all pinned at `0.3.0` (plus `@sneat/random` at `0.0.4` and `@sneat/wormhole` at `^0.0.6` which come from other sources — those stay). All published libs must bump together.

- [ ] **Step 1: Rewrite every `"@sneat/...": "0.3.0"` pin to `"0.4.0"`**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
sed -i '' -E 's|("@sneat/[a-z-]+": )"0\.3\.0"|\1"0.4.0"|g' package.json
```

- [ ] **Step 2: Verify the rewrite left `@sneat/random` and `@sneat/wormhole` alone**

```bash
grep -E '"@sneat/' package.json
```

Expected: every dep that was at `0.3.0` now shows `0.4.0`. `@sneat/random` still `0.0.4`. `@sneat/wormhole` still `^0.0.6`.

- [ ] **Step 3: Reinstall to update the lockfile**

```bash
pnpm install
```

Expected: pnpm fetches the new `0.4.0` versions from npm and updates `pnpm-lock.yaml`. If pnpm errors with `ERR_PNPM_NO_MATCHING_VERSION` for any `@sneat/*` package, that lib didn't publish in Task A7 — go back and inspect `nx release publish` output before proceeding.

### Task B2: Rewrite `apps/sneat-app/src/environments/environment.ts`

**Files:**

- Modify: `apps/sneat-app/src/environments/environment.ts`

- [ ] **Step 1: Replace file contents**

```ts
// This file is replaced during prod builds — see project.json fileReplacements.
import { appSpecificConfig, emulatorEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const sneatAppEnvironmentConfig: IEnvironmentConfig = appSpecificConfig(emulatorEnvironmentConfig);
```

Rationale: dev builds use the emulator config from `@sneat/app`, with `appSpecificConfig` applying the `demo-` projectId prefix. This matches prior behavior where `environment.ts` was effectively `appSpecificConfig(environmentConfig)`.

- [ ] **Step 2: Build dev to verify**

```bash
pnpm nx build sneat-app -c development
```

Expected: PASS.

### Task B3: Rewrite `apps/sneat-app/src/environments/environment.prod.ts`

**Files:**

- Modify: `apps/sneat-app/src/environments/environment.prod.ts`

- [ ] **Step 1: Replace file contents**

```ts
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
    token: 'phc_YBZyRpV92s1kC0D4vYjEQiWhVjK7U9vfyi9vh2jfbsD',
    config: {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
    },
  },
  sentry: {
    dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
  },
};
```

These are exactly the values that were previously imported from `@sneat/app`'s `firebaseConfigForSneatApp` plus the existing posthog/sentry tokens already in this file.

- [ ] **Step 2: Production build**

```bash
pnpm nx build sneat-app
```

Expected: PASS. (`defaultConfiguration` is `production` in `project.json`, so this exercises the file replacement.)

### Task B4: Smoke-test sneat-app dev server

**Files:** none

- [ ] **Step 1: Serve**

```bash
pnpm nx serve sneat-app
```

Expected: server starts on its configured port (typically 4200). Open in browser, verify the app loads. **Do NOT sign in yet** — just confirm the bundle loads without runtime errors in the browser console.

- [ ] **Step 2: Stop the server** (Ctrl-C).

### Task B5: Commit Phase B

**Files:** all of the above

- [ ] **Step 1: Stage and commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
git add package.json pnpm-lock.yaml \
        apps/sneat-app/src/environments/environment.ts \
        apps/sneat-app/src/environments/environment.prod.ts
git commit -m "refactor(sneat-app): inline firebaseConfig, consume @sneat/app@0.4.0

The sneat-eur3-1 Firebase config now lives in this app's own environment
files instead of being imported from @sneat/app. Behavior unchanged."
```

---

## Phase C — Scaffold `apps/sneat-work`

Goal: stand up a second Angular app in the same workspace by copying `apps/sneat-app/`, applying minimal renames, and pointing it at the sneat-work Firebase project.

**Working directory for Phase C:** `/Users/alexandertrakhimenok/projects/sneat-co/sneat-apps`

### Task C1: Sneat-work Firebase web app config (already collected)

No action — values are already known and hardcoded into Tasks C8 and D3. Reference copy:

```
apiKey:            "AIzaSyB2566A1kaT7H2qXSFHwBLcvmw7-nowp78"
authDomain:        "sneat-work.firebaseapp.com"
projectId:         "sneat-work"
storageBucket:     "sneat-work.firebasestorage.app"
messagingSenderId: "125224789205"
appId:             "1:125224789205:web:d9fdf66322b9a871a5ae5c"
measurementId:     "G-3KWL5H12LW"
```

### Task C2: Copy `apps/sneat-app` → `apps/sneat-work`

**Files:**

- Create: `apps/sneat-work/` (entire tree, copied from `apps/sneat-app/`)

- [ ] **Step 1: Recursive copy**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
cp -R apps/sneat-app apps/sneat-work
```

- [ ] **Step 2: Verify the copy**

```bash
ls apps/sneat-work
ls apps/sneat-work/src
ls apps/sneat-work/src/app | head -20
```

Expected: identical file list to `apps/sneat-app` at every level.

### Task C3: Rename `project.json` and update its paths

**Files:**

- Modify: `apps/sneat-work/project.json`

- [ ] **Step 1: Edit**

In `apps/sneat-work/project.json`:

- Change `"name": "sneat-app"` → `"name": "sneat-work"`.
- Change `"sourceRoot": "apps/sneat-app/src"` → `"sourceRoot": "apps/sneat-work/src"`.
- Replace every other occurrence of `apps/sneat-app/` with `apps/sneat-work/` (in `index`, `browser`, `tsConfig`, `assets`, `styles`, `outputPath`).
- Change `"outputPath": "dist/apps/sneat-app"` → `"outputPath": "dist/apps/sneat-work"`.
- In every `serve` configuration, replace `sneat-app:build:...` with `sneat-work:build:...`.

Use sed for accuracy:

```bash
sed -i '' \
  -e 's|apps/sneat-app/|apps/sneat-work/|g' \
  -e 's|"name": "sneat-app"|"name": "sneat-work"|' \
  -e 's|"sneat-app:build|"sneat-work:build|g' \
  -e 's|dist/apps/sneat-app|dist/apps/sneat-work|g' \
  -e 's|coverage/apps/sneat-app|coverage/apps/sneat-work|g' \
  apps/sneat-work/project.json
```

(macOS sed syntax — `-i ''`. On Linux drop the `''`.)

- [ ] **Step 2: Verify**

```bash
grep -n "sneat-app" apps/sneat-work/project.json || echo "no matches — good"
```

Expected: `no matches — good`. If anything still says `sneat-app`, edit by hand.

### Task C4: Update `apps/sneat-work/vite.config.mts` and tsconfig files

**Files:**

- Modify: `apps/sneat-work/vite.config.mts`
- Modify: `apps/sneat-work/tsconfig.app.json`
- Modify: `apps/sneat-work/tsconfig.spec.json`
- Modify: `apps/sneat-work/tsconfig.json`
- Modify: `apps/sneat-work/tsconfig.editor.json`
- Modify: `apps/sneat-work/eslint.config.js`

- [ ] **Step 1: Inspect each file for `sneat-app` references**

```bash
grep -n "sneat-app" apps/sneat-work/vite.config.mts \
                    apps/sneat-work/tsconfig.app.json \
                    apps/sneat-work/tsconfig.spec.json \
                    apps/sneat-work/tsconfig.json \
                    apps/sneat-work/tsconfig.editor.json \
                    apps/sneat-work/eslint.config.js
```

- [ ] **Step 2: Replace `sneat-app` → `sneat-work` in each file where it appears**

For path-only replacements (cacheDirs, project paths), use the same sed pattern as C3:

```bash
for f in apps/sneat-work/vite.config.mts \
         apps/sneat-work/tsconfig.app.json \
         apps/sneat-work/tsconfig.spec.json \
         apps/sneat-work/tsconfig.json \
         apps/sneat-work/tsconfig.editor.json \
         apps/sneat-work/eslint.config.js; do
  [ -f "$f" ] && sed -i '' 's|sneat-app|sneat-work|g' "$f"
done
```

- [ ] **Step 3: Verify**

```bash
grep -rn "sneat-app" apps/sneat-work/ --include='*.json' --include='*.mts' --include='*.ts' --include='*.js' | grep -v 'src/app/'
```

Expected: empty (or only the renames inside `src/app/` which we haven't done yet — those are addressed in C5/C6).

### Task C5: Rename top-level shell component (file, class, selector)

**Files:**

- Rename: `apps/sneat-work/src/app/sneat-app.component.ts` → `apps/sneat-work/src/app/sneat-work.component.ts`
- Rename: `apps/sneat-work/src/app/sneat-app.component.html` → `apps/sneat-work/src/app/sneat-work.component.html`
- Modify: the renamed `.ts` (class name + selector + templateUrl)

- [ ] **Step 1: Rename the files**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
mv apps/sneat-work/src/app/sneat-app.component.ts \
   apps/sneat-work/src/app/sneat-work.component.ts
mv apps/sneat-work/src/app/sneat-app.component.html \
   apps/sneat-work/src/app/sneat-work.component.html
```

- [ ] **Step 2: Edit `sneat-work.component.ts`**

Replace the class declaration. Final file:

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonApp, IonContent, IonHeader, IonIcon, IonMenu, IonRouterOutlet, IonSplitPane, IonText, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BaseAppComponent } from '@sneat/app';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';

@Component({
  selector: 'sneat-work-root',
  templateUrl: 'sneat-work.component.html',
  imports: [IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonIcon, IonText, IonContent, IonRouterOutlet, RouterLink, SneatAppMenuComponent],
})
export class SneatWorkComponent extends BaseAppComponent {}
```

We deliberately keep the `SneatAppMenuComponent` import path (`./sneat-app-menu-component/sneat-app-menu.component`) and the imported class name unchanged — we are not renaming the menu folder/component for v1 (defer to brand divergence later).

- [ ] **Step 3: Edit `sneat-work.component.html` — replace user-visible "sneat.app" with "sneat.work"**

```bash
sed -i '' 's|sneat\.app|sneat.work|g' apps/sneat-work/src/app/sneat-work.component.html
```

The structural HTML stays identical; only the brand text inside `<ion-text>` changes.

### Task C6: Rename routing module file and update imports

**Files:**

- Rename: `apps/sneat-work/src/app/sneat-app-routing.module.ts` → `apps/sneat-work/src/app/sneat-work-routing.module.ts`

- [ ] **Step 1: Rename**

```bash
mv apps/sneat-work/src/app/sneat-app-routing.module.ts \
   apps/sneat-work/src/app/sneat-work-routing.module.ts
```

- [ ] **Step 2: Update the class name inside (for symmetry; optional for compilation since main.ts only consumes the `routes` array export)**

Open the renamed file and change `export class SneatAppRoutingModule` to `export class SneatWorkRoutingModule`. Leave the `routes` array export name as-is (`export const routes`) — main.ts imports it by that name. The internal `import('./pages/sneat-app-home-page/...')` lazy-load paths stay unchanged because we did NOT rename the `pages/` subfolder contents.

### Task C7: Update `apps/sneat-work/src/main.ts`

**Files:**

- Modify: `apps/sneat-work/src/main.ts`

- [ ] **Step 1: Replace file contents**

```ts
// Main entry point for sneat.work

import { bootstrapApplication } from '@angular/platform-browser';
import { getStandardSneatProviders, provideAppInfo, provideRolesByType } from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { routes } from './app/sneat-work-routing.module';
import { SneatWorkComponent } from './app/sneat-work.component';
import { provideRouter } from '@angular/router';
import { sneatWorkEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(SneatWorkComponent, {
  providers: [...getStandardSneatProviders(sneatWorkEnvironmentConfig), provideAppInfo({ appId: 'sneat-work', appTitle: 'sneat.work' }), provideRouter([...routes, ...authRoutes]), provideRolesByType(undefined)],
}).catch((err) => console.error(err));

registerIonicons();
```

### Task C8: Write `apps/sneat-work/src/environments/environment.prod.ts`

**Files:**

- Modify: `apps/sneat-work/src/environments/environment.prod.ts`

- [ ] **Step 1: Replace file contents**

```ts
import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';

const firebaseConfig: IFirebaseConfig = {
  projectId: 'sneat-work',
  apiKey: 'AIzaSyB2566A1kaT7H2qXSFHwBLcvmw7-nowp78',
  authDomain: 'sneat-work.firebaseapp.com',
  messagingSenderId: '125224789205',
  appId: '1:125224789205:web:d9fdf66322b9a871a5ae5c',
  measurementId: 'G-3KWL5H12LW',
};

export const sneatWorkEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig,
};
```

No `posthog` or `sentry` blocks per the design (deferred for v1). Note: `authDomain` stays on `sneat-work.firebaseapp.com` until a custom domain is connected to the sneat-work Hosting site in the Firebase console; once `sneat.work` is verified there, update this literal to `'sneat.work'` in a follow-up.

### Task C9: Write `apps/sneat-work/src/environments/environment.ts`

**Files:**

- Modify: `apps/sneat-work/src/environments/environment.ts`

- [ ] **Step 1: Replace file contents**

```ts
// This file is replaced during prod builds — see project.json fileReplacements.
import { appSpecificConfig, emulatorEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const sneatWorkEnvironmentConfig: IEnvironmentConfig = appSpecificConfig({
  ...emulatorEnvironmentConfig,
  firebaseConfig: {
    ...emulatorEnvironmentConfig.firebaseConfig,
    projectId: 'sneat-work',
  },
});
```

Rationale: in dev/emulator mode, sneat-work talks to a `demo-sneat-work` emulator project (the `demo-` prefix is added inside `appSpecificConfig`). This keeps emulator usage symmetric with sneat-app.

### Task C10: Update `apps/sneat-work/src/index.html`

**Files:**

- Modify: `apps/sneat-work/src/index.html`

- [ ] **Step 1: Edit `<title>` and root selector**

Change `<title>Sneat.app</title>` → `<title>sneat.work</title>` and `<sneat-app-root></sneat-app-root>` → `<sneat-work-root></sneat-work-root>`. The Telegram inline script and meta tags stay as-is.

```bash
sed -i '' \
  -e 's|<title>Sneat.app</title>|<title>sneat.work</title>|' \
  -e 's|<sneat-app-root></sneat-app-root>|<sneat-work-root></sneat-work-root>|' \
  apps/sneat-work/src/index.html
```

### Task C11: Reset Nx graph and verify build

**Files:** none

- [ ] **Step 1: Reset Nx project graph cache**

```bash
pnpm nx reset
```

Expected: cache cleared.

- [ ] **Step 2: Verify Nx sees the new project**

```bash
pnpm nx show projects | grep sneat
```

Expected: includes `sneat-app` and `sneat-work` (and any unrelated `sneat-*` libs already in the workspace).

- [ ] **Step 3: Production build**

```bash
pnpm nx build sneat-work
```

Expected: PASS. If there are TypeScript errors about missing imports, most likely a `sneat-app-routing.module` reference was missed; grep for `sneat-app-routing` under `apps/sneat-work/` and fix.

- [ ] **Step 4: Dev build**

```bash
pnpm nx build sneat-work -c development
```

Expected: PASS.

### Task C12: Smoke-test sneat-work and verify auth lands on the right Firebase project

**Files:** none

- [ ] **Step 1: Serve**

```bash
pnpm nx serve sneat-work
```

- [ ] **Step 2: In a browser, open the served URL** (e.g. `http://localhost:4200` — the actual port is shown in the output). The page title should read **sneat.work**. The side-menu brand text should read **sneat.work**.

- [ ] **Step 3: Sign in via the auth flow** (email or Google — whichever is enabled in the sneat-work Firebase project). After redirect, open browser devtools → Application → IndexedDB → `firebaseLocalStorageDb` → `firebaseLocalStorage` → look for the auth user record. The `apiKey` and `authDomain` fields on the persisted auth user should match the **sneat-work** project, NOT `sneat-eur3-1`.

- [ ] **Step 4: Cross-check in Firebase console** — go to the sneat-work project → Authentication → Users. The user you just signed in as should appear there with a UID. Note the UID for Phase D verification.

- [ ] **Step 5: Stop the server** (Ctrl-C).

### Task C13: Commit Phase C

**Files:** all of the above

- [ ] **Step 1: Stage and commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
git add apps/sneat-work
git commit -m "feat(sneat-work): scaffold B2B sibling app pointing at sneat-work Firebase project

Copy of apps/sneat-app with renamed shell component (SneatWorkComponent),
new env files declaring the sneat-work firebaseConfig, and provideAppInfo
appId='sneat-work'. Internal pages, routes, and the side-menu component
are unchanged for v1 — brand divergence is deferred."
```

---

## Phase D — Wire `issue-number-one` to `@sneat/*` and the sneat-work Firebase project

Goal: turn the bare in1app scaffold into an app that uses the same auth flow as `apps/sneat-work`, sharing the sneat-work Firebase project.

**Working directory for Phase D:** `/Users/alexandertrakhimenok/projects/sneat-co/issue-number-one`

### Task D1: Add `@sneat/*` and Firebase dependencies

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Verify clean working tree**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/issue-number-one
git status
```

- [ ] **Step 2: Install runtime deps**

All `@sneat/*` deps are pinned to `0.4.0` to match Phase A's fixed-version release.

```bash
pnpm add \
  @sneat/app@0.4.0 \
  @sneat/auth-core@0.4.0 \
  @sneat/auth-ui@0.4.0 \
  @sneat/core@0.4.0 \
  @sneat/logging@0.4.0 \
  @sneat/api@0.4.0 \
  @sneat/random \
  @angular/fire \
  firebase \
  @ionic/angular \
  ionicons \
  @capacitor/core
```

Notes:

- `@capacitor/core` is required at runtime by `@sneat/app`'s `init-firebase.ts` (`Capacitor.isNativePlatform()` check), even for web-only builds.
- `@ionic/angular` is required at runtime because `getStandardSneatProviders` calls `provideIonicAngular()`.
- `@sneat/logging`, `@sneat/api`, and `@sneat/random` are transitive runtime dependencies of `@sneat/app`'s `getStandardSneatProviders` — they must be installed so the provider bundle resolves. If pnpm surfaces additional missing peer deps at build time, install them too at `@0.4.0`.
- `@sneat/random` is intentionally unpinned — plan-time inspection of `sneat-apps/package.json` shows it at `0.0.4` (independent version, not part of the 0.3.0 → 0.4.0 sync).

- [ ] **Step 3: Verify**

```bash
grep -E '"@sneat/(app|auth-core|auth-ui|core)"|@angular/fire|firebase|@ionic/angular|@capacitor/core' package.json
```

Expected: all the new deps appear in `dependencies`.

### Task D2: Create `src/environments/environment.ts`

**Files:**

- Create: `src/environments/environment.ts`

- [ ] **Step 1: Create the file**

```ts
// This file is replaced during prod builds — see project.json fileReplacements.
import { appSpecificConfig, emulatorEnvironmentConfig } from '@sneat/app';
import { IEnvironmentConfig } from '@sneat/core';

export const in1AppEnvironmentConfig: IEnvironmentConfig = appSpecificConfig({
  ...emulatorEnvironmentConfig,
  firebaseConfig: {
    ...emulatorEnvironmentConfig.firebaseConfig,
    projectId: 'sneat-work',
  },
});
```

### Task D3: Create `src/environments/environment.prod.ts`

**Files:**

- Create: `src/environments/environment.prod.ts`

- [ ] **Step 1: Create the file**

Identical `firebaseConfig` literal to Task C8 (same Firebase project shared between sneat-work and in1app).

```ts
import { IEnvironmentConfig, IFirebaseConfig } from '@sneat/core';

const firebaseConfig: IFirebaseConfig = {
  projectId: 'sneat-work',
  apiKey: 'AIzaSyB2566A1kaT7H2qXSFHwBLcvmw7-nowp78',
  authDomain: 'sneat-work.firebaseapp.com',
  messagingSenderId: '125224789205',
  appId: '1:125224789205:web:d9fdf66322b9a871a5ae5c',
  measurementId: 'G-3KWL5H12LW',
};

export const in1AppEnvironmentConfig: IEnvironmentConfig = {
  production: true,
  agents: {},
  firebaseConfig,
};
```

### Task D4: Add file replacement to `project.json`

**Files:**

- Modify: `project.json`

- [ ] **Step 1: Inspect the current build target**

```bash
cat project.json | head -60
```

- [ ] **Step 2: Add `fileReplacements` to the `build.configurations.production` block**

If the file already has a `production` configuration block under `build`, add a `fileReplacements` array to it. If there is no `production` block yet, add one. The end result for that block should look like:

```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ],
  "outputHashing": "all"
}
```

The exact surrounding JSON structure depends on what the Nx generator put there at scaffold time. The principle: production builds replace `environment.ts` with `environment.prod.ts`, matching the sneat-app pattern.

### Task D5: Rewrite `src/app/app.config.ts`

**Files:**

- Modify: `src/app/app.config.ts`

- [ ] **Step 1: Replace file contents**

```ts
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

### Task D6: Build and serve in1app

**Files:** none

- [ ] **Step 1: Build dev**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/issue-number-one
pnpm nx build
```

Expected: PASS. If pnpm complains about missing `register-ionicons` calls or unregistered icons at runtime, that's fine for v1 — we're not rendering Ionic UI in in1app yet, only consuming the provider stack.

Possible failure modes and fixes:

- **TS error**: `Cannot find module '../environments/environment'`. Fix: ensure the file was created at `src/environments/environment.ts` (note: relative to `src/app/app.config.ts`, which is in `src/app/`, so `../environments/` resolves to `src/environments/`).
- **Angular peer dep error**: in1app's Angular version doesn't match what `@sneat/app@0.4.0` was built against. Both repos are on `~21.2.0` per their `package.json` files, but verify with `pnpm list @angular/core` if you hit this.
- **TS error**: `@sneat/app` types not found. Fix: in1app's `tsconfig.json` may need `"skipLibCheck": true` (sneat-apps already has this; check sneat-libs for the same).

- [ ] **Step 2: Serve**

```bash
pnpm nx serve
```

- [ ] **Step 3: In a browser, navigate to the auth sign-in route** (the path is whatever `@sneat/auth-ui` defines via `authRoutes`; common path is `/login` or `/sign-in`). Sign in with the same credentials you used in Phase C, Task C12.

- [ ] **Step 4: Verify same UID** — in the sneat-work Firebase project's Authentication → Users page, confirm the user's `Last sign-in` timestamp updated and the UID is unchanged from the Phase C12 session. This proves both apps point at the same Firebase Auth tenant.

- [ ] **Step 5: Stop the server**.

### Task D7: Commit Phase D

**Files:** all of the above

- [ ] **Step 1: Stage and commit**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/issue-number-one
git add package.json pnpm-lock.yaml \
        src/environments/environment.ts src/environments/environment.prod.ts \
        src/app/app.config.ts \
        project.json
git commit -m "feat: wire @sneat/* providers and sneat-work Firebase auth

issue-number-one now consumes @sneat/app@0.4.0, @sneat/auth-core,
@sneat/auth-ui, and @sneat/core, and authenticates against the
sneat-work Firebase project shared with apps/sneat-work."
```

---

## Phase E — Deploy sneat-work to Firebase Hosting

Goal: replicate the sneat-app deploy mechanism for sneat-work, targeting the sneat-work Firebase project. Most edits are in two repos: `sneat-sites` (hosting config + landing page) and `sneat-devops` (deploy script).

**Prerequisite:** The sneat-work Firebase project has a default Hosting site already (created when the project was created). Its site name is `sneat-work` (matches the project ID). If for some reason the default site has a different name, run `firebase hosting:sites:list --project sneat-work` to check; update the site name in Task E3 accordingly. No explicit `hosting:sites:create` is needed.

### Task E1: Create the `sneat.work` landing page

**Files:**

- Create: `sneat-sites/websites/sneat.work/` (copy of `websites/sneat.app/`, with brand text replaced)

**Working directory:** `/Users/alexandertrakhimenok/projects/sneat-co/sneat-sites`

- [ ] **Step 1: Copy the landing site**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-sites
cp -R websites/sneat.app websites/sneat.work
```

- [ ] **Step 2: Remove any pre-existing `pwa/` subfolder from the copy**

```bash
rm -rf websites/sneat.work/pwa
```

The deploy script will populate `pwa/` with the sneat-work Angular build at deploy time.

- [ ] **Step 3: Replace brand text in all HTML/CSS/JS files**

```bash
find websites/sneat.work -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' -o -name '*.txt' -o -name '*.xml' \) \
  -exec sed -i '' 's|sneat\.app|sneat.work|g' {} +
find websites/sneat.work -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' -o -name '*.txt' -o -name '*.xml' \) \
  -exec sed -i '' 's|Sneat\.app|sneat.work|g' {} +
```

- [ ] **Step 4: Spot-check**

```bash
grep -rn "sneat\.app\|Sneat\.app" websites/sneat.work/ || echo "no leftover sneat.app references — good"
```

Expected: no leftover references (or only inside binary assets like images, which won't match grep).

### Task E2: Add hosting target to `sneat-sites/firebase.json`

**Files:**

- Modify: `sneat-sites/firebase.json`

- [ ] **Step 1: Add a new entry to the `hosting` array**

Open `sneat-sites/firebase.json`. The existing file has a top-level `"hosting": [...]` array with several entries (`togethered`, `sneat-eu`, `sneatapp`, `sneat-app-eur3-1`, `logistus`). Append a new entry:

```json
{
  "target": "sneat-work",
  "public": "websites/sneat.work",
  "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
  "rewrites": [
    {
      "source": "/pwa/**",
      "destination": "/pwa/index.html"
    }
  ]
}
```

- [ ] **Step 2: Validate JSON**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-sites
node -e "JSON.parse(require('fs').readFileSync('firebase.json', 'utf8'))" && echo "valid JSON"
```

Expected: `valid JSON`.

### Task E3: Add sneat-work project alias and target mapping to `sneat-sites/.firebaserc`

**Files:**

- Modify: `sneat-sites/.firebaserc`

- [ ] **Step 1: Edit the file**

Current contents:

```json
{
  "projects": {},
  "targets": {
    "sneat-eur3-1": {
      "hosting": {
        "togethered": ["togethered"]
      }
    }
  },
  "etags": {}
}
```

Add the sneat-work project alias and a target mapping. Final contents:

```json
{
  "projects": {
    "sneat-work": "sneat-work"
  },
  "targets": {
    "sneat-eur3-1": {
      "hosting": {
        "togethered": ["togethered"]
      }
    },
    "sneat-work": {
      "hosting": {
        "sneat-work": ["sneat-work"]
      }
    }
  },
  "etags": {}
}
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('.firebaserc', 'utf8'))" && echo "valid JSON"
```

### Task E4: Update `sneat-devops/deploy-pwa.ps1` to support an explicit `--project` flag

**Files:**

- Modify: `sneat-devops/deploy-pwa.ps1`

**Working directory:** `/Users/alexandertrakhimenok/projects/sneat-co/sneat-devops`

- [ ] **Step 1: Edit the script**

Current `deploy-pwa.ps1` accepts two args (`$app_name`, `$hosting`) and runs `firebase deploy --only hosting:$hosting` without `--project`. Add a third positional argument `$project`. Final file:

```powershell
# Check if there are no arguments
if ($args.Length -lt 3) {
  Write-Host 'Usage: deploy-pwa.ps1 <app_name> <hosting_target> <firebase_project>'
  Write-Host 'Example: deploy-pwa.ps1 sneat-app sneat-app-eur3-1 sneat-eur3-1'
  Write-Host 'Example: deploy-pwa.ps1 sneat-work sneat-work sneat-work'
  exit
}

$location = Get-Location

try {
    $app_name = $args[0]
    $hosting = $args[1]
    $project = $args[2]

    Write-Host '$PSScriptRoot:', $PSScriptRoot
    $sneat_root = Resolve-Path $PSScriptRoot/..
    $sneat_apps = Resolve-Path $sneat_root/sneat-apps
    $sneat_sites = Resolve-Path $sneat_root/sneat-sites/websites

    Write-Host 'sneat_apps:', $sneat_apps
    Write-Host 'project:', $project

    Set-Location -Path $sneat_apps
    $gitHash = (git log -1 --format=%H)
    $buildTimestamp = (date -u +"%Y-%m-%d %H:%M:%S")

    $filePath = "libs/components/src/lib/app-version/build-info.ts";
    (Get-Content $filePath) -replace "gitHash:\s*'(.+?)'", "gitHash: '$gitHash'" | Set-Content $filePath
    (Get-Content $filePath) -replace "buildTimestamp:\s*'(.+?)'", "buildTimestamp: '$buildTimestamp'" | Set-Content $filePath

    pnpm run nx build $app_name --source-map=true --base-href=/pwa/

    git restore libs/components/src/lib/app-version/build-info.ts

    $dist_path = Resolve-Path $sneat_apps/dist/apps/$app_name
    Write-Host '$dist_path:', $dist_path

    Write-Host 'dist_path', $dist_path
    Set-Location -Path $sneat_root
    $pwaIndexHtml = Resolve-Path $dist_path/index.html
    (Get-Content $pwaIndexHtml) -replace '<base href="/"', '<base href="/pwa/"' | Out-File -encoding UTF8 $pwaIndexHtml

    $target_site = Resolve-Path $sneat_sites/$app_name
    Write-Host 'target_site:', $target_site
    Remove-Item -Recurse -Force "$target_site/pwa" -ErrorAction SilentlyContinue
    Copy-Item $dist_path "$target_site/pwa" -Force -Recurse
    Set-Location -Path (Resolve-Path $sneat_root/sneat-sites)
    firebase deploy --only hosting:$hosting --project $project
}
catch {
  Write-Host 'An error occurred: ', $_
}
finally {
    Set-Location -Path $location
}
```

Two notable changes vs. the original:

1. **Required third arg `$project`** with usage echoed at top.
2. **`firebase deploy --only hosting:$hosting --project $project`** instead of relying on the implicit default.
3. **Replaced hardcoded `$sneat_sites/sneat.app/pwa`** with `$sneat_sites/$app_name/pwa` so the same script handles both `sneat-app` (deploys to `websites/sneat.app/pwa`) and `sneat-work` (deploys to `websites/sneat.work/pwa`). This requires that the site folder name match the app name — verify by checking `ls /Users/alexandertrakhimenok/projects/sneat-co/sneat-sites/websites`. If the existing `sneat.app` folder doesn't match, leave it as `$sneat_sites/sneat.app/pwa` for the legacy app and add a special case for sneat-work, or rename the folders. **Recommended:** add an explicit mapping at the top of the script:
   ```powershell
   $site_folder_map = @{
     'sneat-app'  = 'sneat.app'
     'sneat-work' = 'sneat.work'
   }
   $target_site = Resolve-Path $sneat_sites/$site_folder_map[$app_name]
   ```
   Use this version if `apps/sneat-app` deploys to `websites/sneat.app/` (which it does per plan-time inspection).

- [ ] **Step 2: Verify the script syntactically**

PowerShell on macOS isn't always installed; if it isn't, skip syntactic verification and rely on the deploy run itself to surface errors.

```bash
which pwsh || echo "pwsh not installed — verification deferred to deploy run"
```

If `pwsh` is available:

```bash
pwsh -Command "Get-Command -Syntax /Users/alexandertrakhimenok/projects/sneat-co/sneat-devops/deploy-pwa.ps1"
```

### Task E5: Add `scripts/deploy2prod-work.sh` wrapper in sneat-apps

**Files:**

- Create: `sneat-apps/scripts/deploy2prod-work.sh`

- [ ] **Step 1: Create the wrapper**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
cat > scripts/deploy2prod-work.sh <<'EOF'
#!/bin/sh
pwsh ./../sneat-devops/deploy-pwa.ps1 sneat-work sneat-work sneat-work
EOF
chmod +x scripts/deploy2prod-work.sh
```

The existing `scripts/deploy2prod.sh` calls the PowerShell script for sneat-app — `deploy2prod-work.sh` is its sneat-work twin. Note: the existing script's exact form is `./../../sneat-devops/deploy2prod.sh` (which references a `deploy2prod.sh` in sneat-devops that wasn't visible at plan time — it may exist or the existing script may be broken; do not assume). The new script directly invokes `deploy-pwa.ps1` with the three required args, which is the safe path.

- [ ] **Step 2: Optionally update `scripts/deploy2prod.sh`** to also use the explicit form:

```sh
#!/bin/sh
pwsh ./../sneat-devops/deploy-pwa.ps1 sneat-app sneat-app-eur3-1 sneat-eur3-1
```

This makes both scripts consistent and removes reliance on whatever indirection `./../../sneat-devops/deploy2prod.sh` was doing. **Only change `deploy2prod.sh` if the user confirms** — the original may be intentionally indirected. Default: leave it alone.

### Task E6: First sneat-work deploy

**Files:** none (deployment)

- [ ] **Step 1: Verify you are logged into the right Firebase account**

```bash
firebase login:list
```

Expected: includes the email account that owns the sneat-work project.

- [ ] **Step 2: Sanity-check the project is reachable**

```bash
firebase projects:list | grep sneat-work
```

Expected: `sneat-work` appears.

- [ ] **Step 3: Run the deploy**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
sh scripts/deploy2prod-work.sh
```

Expected output (high level):

1. Build runs: `pnpm run nx build sneat-work --source-map=true --base-href=/pwa/`
2. Build artifacts copied to `/Users/alexandertrakhimenok/projects/sneat-co/sneat-sites/websites/sneat.work/pwa/`
3. `<base href="/">` rewritten to `<base href="/pwa/">` in `index.html`
4. `firebase deploy --only hosting:sneat-work --project sneat-work` runs from inside `sneat-sites/`
5. Final output prints the hosted URL (typically `https://<SNEAT_WORK_HOSTING_SITE>.web.app`)

- [ ] **Step 4: Open the hosted URL** in a browser. Verify the landing page (`index.html`) loads. Then navigate to `/pwa/` and verify the Angular app loads. Sign in. The auth flow should land on the same sneat-work Firebase project as in Phase C12 / Phase D6.

- [ ] **Step 5: If `sneat.work` custom domain is connected**, verify it also serves the same content. (DNS may take time — not blocking.)

### Task E7: Commit Phase E

**Files:** all of the above, across three repos

- [ ] **Step 1: Commit in `sneat-sites`**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-sites
git add websites/sneat.work firebase.json .firebaserc
git commit -m "feat: add sneat.work hosting site

New websites/sneat.work landing page (cloned from sneat.app), new
'sneat-work' hosting target wired to the sneat-work Firebase project
via .firebaserc."
```

- [ ] **Step 2: Commit in `sneat-devops`**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-devops
git add deploy-pwa.ps1
git commit -m "feat: add explicit \$project arg to deploy-pwa.ps1

Required third positional arg passed through as 'firebase deploy
--project'. Site folder lookup now keyed off app_name to support
both sneat-app and sneat-work."
```

- [ ] **Step 3: Commit in `sneat-apps`**

```bash
cd /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps
git add scripts/deploy2prod-work.sh
git commit -m "feat: add deploy2prod-work.sh wrapper for sneat-work hosting deploys"
```

---

## Execution runbook (for running the plan on another machine)

This plan is fully self-contained. Everything needed to run it end-to-end is inlined above (Firebase keys, site names, version targets, commit messages). No further interactive decisions are required.

### Prerequisites on the target machine

1. **Clone the five repos** under a common parent directory (the plan's absolute paths assume `/Users/alexandertrakhimenok/projects/sneat-co/` — if your layout differs, find-and-replace that path throughout the plan before running, or symlink):
   ```bash
   mkdir -p ~/projects/sneat-co && cd ~/projects/sneat-co
   git clone git@github.com:sneat-co/sneat-libs.git
   git clone git@github.com:sneat-co/sneat-apps.git
   git clone git@github.com:sneat-co/issue-number-one.git
   git clone git@github.com:sneat-co/sneat-sites.git
   git clone git@github.com:sneat-co/sneat-devops.git
   ```
   (Adjust the remote URLs if they differ from what GitHub currently hosts.)
2. **Install toolchain**: Node (match `.nvmrc` if present), pnpm, Firebase CLI (`npm i -g firebase-tools`), PowerShell (`brew install --cask powershell` on macOS — required for `sneat-devops/deploy-pwa.ps1`).
3. **Authenticate**:
   - `npm login` — the account must have publish rights on the `@sneat/*` scope.
   - `firebase login` — the account must own both the `sneat-eur3-1` and `sneat-work` Firebase projects.
4. **Install workspace deps** in each repo that has a `package.json`:
   ```bash
   cd ~/projects/sneat-co/sneat-libs && pnpm install
   cd ~/projects/sneat-co/sneat-apps && pnpm install
   cd ~/projects/sneat-co/issue-number-one && pnpm install
   cd ~/projects/sneat-co/sneat-sites && [ -f package.json ] && pnpm install || true
   ```
5. **Confirm all five repos are on `main` and clean**:
   ```bash
   for d in sneat-libs sneat-apps issue-number-one sneat-sites sneat-devops; do
     echo "=== $d ==="
     git -C ~/projects/sneat-co/$d status --short --branch
   done
   ```
   Expected: each shows `## main...origin/main` with no working-tree changes. If anything is dirty, resolve before starting.

### Start execution

The plan is at `sneat-apps/docs/superpowers/plans/2026-04-08-consumer-and-work-app-split.md` (same file you are reading). To run it end-to-end with an agent:

**Option A — Subagent-Driven (recommended)**

In a Claude Code session with the superpowers plugin installed, say:

> Execute `sneat-apps/docs/superpowers/plans/2026-04-08-consumer-and-work-app-split.md` using the superpowers:subagent-driven-development skill. All answers are already locked into the plan header — proceed autonomously through all five phases including the `nx release` publish and the Firebase deploy. No pauses.

**Option B — Inline execution**

> Execute `sneat-apps/docs/superpowers/plans/2026-04-08-consumer-and-work-app-split.md` using the superpowers:executing-plans skill. Run all five phases sequentially. All decisions are locked in the plan header.

**Option C — Manual**

Follow the tasks in order, top to bottom. Every task is self-contained with exact file paths, exact shell commands, and expected output.

### Expected wall-clock duration

- Phase A: 5–15 min (most time is `nx release publish` + npm propagation)
- Phase B: 5 min
- Phase C: 15–30 min (most time is the recursive copy + verification + manual auth sign-in check)
- Phase D: 10–20 min
- Phase E: 10–20 min (Firebase deploy + hosting propagation)

Total: roughly 1 hour of active work if everything goes smoothly. Plan for 2–3× that with debugging.

### If something goes wrong

- **Phase A publish fails partway (some libs published, others not).** `nx release publish` is idempotent for already-published libs (npm returns 403 `version already exists`, which the tool treats as a skip). Re-run `pnpm nx release publish` to finish the job.
- **Phase A nx release refuses to bump because `projectsRelationship` isn't set.** Add `"projectsRelationship": "fixed"` under `"release"` in `sneat-libs/nx.json`, commit, retry.
- **Phase B pnpm install fails with `ERR_PNPM_NO_MATCHING_VERSION`.** Wait 60 seconds for npm propagation and retry. If still failing, one of the libs didn't publish — verify with `npm view @sneat/<name>@0.4.0`.
- **Phase C sneat-work build fails on a `./pages/*` import.** The copy missed a file; re-run `cp -R apps/sneat-app apps/sneat-work` for any missing path.
- **Phase D in1app fails with peer dep errors.** in1app's Angular version may drift from sneat-apps' — verify both repos have the same `@angular/*` major.minor.
- **Phase E deploy fails with `HTTP 403`.** The logged-in Firebase account doesn't have permission on the sneat-work project — run `firebase login --reauth` with the right account.
- **Anything else.** Stop, read the error, and ask a human.

## Final verification checklist

After all phases are complete and committed:

- [ ] `pnpm nx build sneat-app` → PASS in `sneat-apps`
- [ ] `pnpm nx build sneat-work` → PASS in `sneat-apps`
- [ ] `pnpm nx build` → PASS in `issue-number-one`
- [ ] `pnpm nx build app` → PASS in `sneat-libs`
- [ ] `npm view @sneat/app@0.4.0` shows the new version on the registry
- [ ] sneat.app continues serving from `sneat-eur3-1` (no regression — verify a single sign-in)
- [ ] sneat.work served from Firebase Hosting, signs users into the `sneat-work` project
- [ ] in1app (locally) signs users into the `sneat-work` project, same UID as sneat.work for the same user
- [ ] No `prodEnvironmentConfig` / `firebaseConfigForSneatApp` references remain anywhere:
  ```bash
  grep -rn "prodEnvironmentConfig\|firebaseConfigForSneatApp" \
    /Users/alexandertrakhimenok/projects/sneat-co/sneat-libs/libs \
    /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps/apps \
    /Users/alexandertrakhimenok/projects/sneat-co/sneat-apps/libs \
    /Users/alexandertrakhimenok/projects/sneat-co/issue-number-one/src \
    || echo "clean — no references"
  ```
  Expected: `clean — no references`.
