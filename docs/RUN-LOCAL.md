# Running sneat-app locally (full stack)

The local stack has **three** services. Start them in this order. All share the
Firebase project id **`local-sneat-app`** (this is what the Angular app's
emulator config uses — keep every service on the same id).

| #   | Service                               | Where                     | Port(s)                                  |
| --- | ------------------------------------- | ------------------------- | ---------------------------------------- |
| 1   | Firebase emulators (auth + firestore) | `sneat-firebase/firebase` | auth `9099`, firestore `8080`, UI `8070` |
| 2   | Backend API (`sneat-go-server`)       | `sneat-go`                | `4300`                                   |
| 3   | Web app (`sneat-app`)                 | `sneat-apps`              | `4200`                                   |

> Repos are sibling checkouts under the same parent directory
> (e.g. `~/projects/sneat-co/{sneat-apps,sneat-go,sneat-firebase}`).

## 1. Firebase emulators

```bash
cd ../sneat-firebase/firebase
firebase emulators:start --only auth,firestore --project local-sneat-app
```

- Auth UI: <http://127.0.0.1:8070/auth> · Firestore UI: <http://127.0.0.1:8070/firestore>

## 2. Backend API — sneat-go-server

```bash
cd ../sneat-go
GOOGLE_CLOUD_PROJECT=local-sneat-app \
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099 \
FIRESTORE_EMULATOR_HOST=localhost:8080 \
go run ./cmd/sneatserver          # serves on :4300 (PORT overrides)
```

> The build is large. If the Go compiler is OOM-killed (`signal: killed`),
> build single-threaded: `go build -p 1 -o /tmp/sneatserver ./cmd/sneatserver`
> then run `/tmp/sneatserver` with the same env vars.
>
> Note: the `sneat-go` README's `GOOGLE_CLOUD_PROJECT="demo-sneat"` is stale —
> use `local-sneat-app` to match the web app.

## 3. Web app — sneat-app

```bash
cd ../sneat-apps
pnpm install
pnpm nx serve sneat-app           # http://localhost:4200
```

## Verify

1. Open <http://localhost:4200/> and sign in (creates a user in the **auth
   emulator** — watch it at <http://127.0.0.1:8070/auth>).
2. Open/create a space and go to **`…/lists`** — list pages are served by the
   published `@sneat/extension-listus` package; their data flows
   app → `sneat-go-server` (`:4300`) → firestore emulator (`:8080`).

Auth + navigation work with just steps 1 & 3; **list data needs step 2** (the
backend).
