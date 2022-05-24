# How to set up dev environment to develop & run `Sneat.app` locally

This is an open source project that can improve your life.
You are welcome to contribute to make it even better for yourself and others.

Here is how to start.

## Installing required tools & dependencies

To develop & run **Sneat.app** locally you would need:

1. Install [Node.js](https://nodejs.org/) - a JavaScript runtime.
2. Install [PNPM](https://pnpm.io/) - like [NPM](https://www.npmjs.com/) but faster
3. Install [Firebase Tools](https://firebase.google.com/docs/cli) (_for
   running [Firebase emulators](https://firebase.google.com/docs/emulator-suite)_)
4. Install Java (_for running Firebase emulators_)
5. Install [Go](https://go.dev/) language (_for running server side code_)
6. Clone repositories
    1. [github.com/sneat-co/sneat-apps](https://github.com/sneat-co/sneat-apps) - client side (_Progressive Web App_)
    2. [github.com/sneat-co/sneat-go](https://github.com/sneat-co/sneat-go) - server side (_writes data to DB_)
7. Running Sneat.app locally processes:
   1. Run Firebase emulators
   2. Run Server side
   3. Run Client side progressive web app

After above steps successful the local development version of the Sneat.app
should be available at [http://localhost:4200](http://localhost:4200).  

Here is the instructions how to do this step by step.

### 1. Install Node JS

If you don't have Node JS you need to [download](https://nodejs.org/en/download/) & install it.
We recommend to use current LTS version but should not be a problem to run the latest.

### 2. Install PNPM

`> npm i -g pnpm`
The `pnpm` is a package manager that is like NPM but caches packages
and use re-uses them by creating a symbolic links. This works much faster.

### 3. Install Firebase Tools

The [Firebase Tools](https://firebase.google.com/docs/cli)
is an [open source](https://github.com/firebase/firebase-tools) CLI.
It is used emulate locally Firebase authentication & datastore.

Installation instructions can be found [here](https://firebase.google.com/docs/cli#install_the_firebase_cli).

### 4. Install Java

To run Firebase emulators you need Java runtime. If you don't have one you can download and install it
from [Java Downloads](https://www.oracle.com/java/technologies/downloads/) page.

### 5. Install Go language

The server side of the Sneat.app is being developed using mostly Go language.

[Go](https://go.dev/) is a language developed & maintained by Google. It is strongly typed, lightweight, reliable &
fairly simple.
It's well suited for server APIs and handling concurrent requests.

You can download it here https://go.dev/dl/

You can use the latest version locally but beer in mind that
when deployed v15 will be used due to limitations
of the [Google App Engine Standard](https://cloud.google.com/appengine/docs/standard/go) environment.
In the future we might consider migrating to Google App Engine Flex or Compute Engine or something different
but for now App Engine Standard works best for us.

## 7. Running Sneat.app locally

### 7.1 Running Firebase Emulators
```shell
> cd ~/sneat/sneat-go
~/sneat/sneat-go> firebase emulators:start --only auth,firestore --config firebase/firebase.json --import ./firebase/local_data --export-on-exit ./firebase/local_data
```
There is a shortcut batch file `serve_fb_emulator.sh`:
```shell
~/sneat/sneat-go> ./serve_fb_emulator.sh
```

## 7.2 Running server side
```shell
> cd ~/sneat/sneat-go
~/sneat/sneat-go> export GCLOUD_PROJECT="demo-local-sneat-app"
~/sneat/sneat-go> export FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
~/sneat/sneat-go> export FIRESTORE_EMULATOR_HOST="localhost:8080"
~/sneat/sneat-go> go run ./gae
```

There is a shortcut batch file `serve_gae.sh`:
```shell
~/sneat/sneat-go> ./serve_gae.sh
```

## 7.3 Running Client progressive web app

Preferable way is not to use global `nx` but to use:

```shell
pnpm run nx serve <APP_NAME>
```

Shorter way:

```shell
pnpx nx serve <APP_NAME>
```

To make it even shorter create a shortcut:

```shell
alias pnx="pnpm run nx"
```

And run as:

```shell
pnx serve <APP_NAME>
```

[//]: # (### Run with source maps)

[//]: # ()

[//]: # (For some reason the serve is running with enabled optimization and no source maps.)

[//]: # (It results in troubles with debugging.)

[//]: # ()

[//]: # (Here is how to run dev server properly for datatug app:)

[//]: # ()

[//]: # (```shell)

[//]: # (pnx serve datatug --optimization=false --sourceMap=true)

[//]: # (```)

## Troubleshooting

### Performance: Sizes of bundles

To see chunks size graph:

1. Install NMP package **source-map-explorer**: `pnpm add -g source-map-explorer`
2. Build with source maps
3. Run `source-map-explorer dist/apps/datatug/main.js`

## Have we missed anything?

If you noticed we've missed anything that could help
to set up quicker and develop easier please
[create an issue](https://github.com/sneat-co/sneat-apps/issues/new?labels=development)
with a `development` label.

## Give it a try?

Before deciding if you want to join why not to try the app - [https://sneat.app/pwa/](https://sneat.app/pwa/).

If you found an issue with the app please [create a bug](https://github.com/sneat-co/sneat-apps/issues/new?labels=bug).
Even better if you submit a pull request to fix it! :)
