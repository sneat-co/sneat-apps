# Running sneat-app locally (full stack)

The local stack has **three** services. Start them in this order.

| #   | Service                               | Where                     | Port(s)                                  |
| --- | ------------------------------------- | ------------------------- | ---------------------------------------- |
| 1   | Firebase emulators (auth + firestore) | `sneat-firebase/firebase` | auth `9099`, firestore `8080`, UI `8070` |
| 2   | Backend API (`sneat-go-server`)       | `sneat-go`                | `4300`                                   |
| 3   | Web app (`sneat-app`)                 | `sneat-apps`              | `4200`                                   |

> Repos are sibling checkouts under the same parent directory
> (e.g. `~/projects/sneat-co/{sneat-apps,sneat-go,sneat-firebase}`).

## Firebase project id — `demo-local-sneat-app`

The web app's emulator config sets `projectId: 'local-sneat-app'`, but
`appSpecificConfig` **prepends `demo-` when emulators are used**, so the app
actually talks to project **`demo-local-sneat-app`**. The emulators and
`sneat-go-server` must use that same id, or auth/firestore data won't line up.

## 1. Firebase emulators

```bash
cd ../sneat-firebase/firebase
firebase emulators:start --only auth,firestore --project demo-local-sneat-app
```

- Auth UI: <http://127.0.0.1:8070/auth> · Firestore UI: <http://127.0.0.1:8070/firestore>

## 2. Backend API — sneat-go-server

```bash
cd ../sneat-go
GOOGLE_CLOUD_PROJECT=demo-local-sneat-app \
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 \
FIRESTORE_EMULATOR_HOST=localhost:8080 \
go run ./cmd/sneatserver          # serves on :4300 (PORT overrides)
```

> The build is large. If the Go compiler is OOM-killed (`signal: killed`),
> build single-threaded: `go build -p 1 -o /tmp/sneatserver ./cmd/sneatserver`
> then run `/tmp/sneatserver` with the same env vars.
>
> The `sneat-go` README's `GOOGLE_CLOUD_PROJECT="demo-sneat"` is stale.

## 3. Web app — sneat-app

```bash
cd ../sneat-apps
pnpm install
pnpm nx serve sneat-app           # http://localhost:4200
```

## Networking — proper setup vs quick smoke test

The app is wired for an **nginx HTTPS proxy** (see `sneat-devenv/nginx-conf/`):
`/etc/hosts` maps `local-*.sneat.ws` → `127.0.0.1`, and the app calls
`https://local-api.sneat.ws/v0` (api → `:4300`), with `local-app/-fb-auth/`
`-firestore.sneat.ws:443` proxying to `:4200/:9099/:8080`. Access the app at
**<https://local-app.sneat.ws>** when nginx + self-signed certs are set up.

### Quick smoke test on plain `localhost` (no nginx)

Open the app at **<http://localhost:4200>** instead. Because the hostname is
`localhost` (not `local-app.sneat.ws`), the app already points auth/firestore at
`127.0.0.1:9099`/`:8080` directly. Only the **API base** stays at
`https://local-api.sneat.ws`, so override it for the smoke test (uncommitted):

```ts
// apps/sneat-app/src/main.ts — TEMP, do not commit
import { SneatApiBaseUrl } from '@sneat/api';
// ...providers: after ...getStandardSneatProviders(...):
{ provide: SneatApiBaseUrl, useValue: 'http://localhost:4300/v0/' },
```

CORS allows `localhost` origins (`sneat-go-core/security/known_origins.go`), so
the go-server accepts requests from `http://localhost:4200`.

## Verify

1. Open the app and **sign in** (creates a user in the **auth emulator** —
   watch it at <http://127.0.0.1:8070/auth>).
2. Open/create a space and go to **`…/lists`** — list pages come from the
   published `@sneat/extension-listus` package; data flows
   app → `sneat-go-server` (`:4300`) → firestore emulator (`:8080`).

Auth + navigation work with just the emulators + app; **list data needs the
backend (step 2)**.
