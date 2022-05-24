# How to set up dev environment to develop & run `Sneat.app` locally

This is an open source project. You are welcome to contribute.

## Installing required tools & dependencies

To develop & run Sneat.app locally you need:

1. Install Node JS.
2. Install PNPM - like NPM but faster
4. Install Firebase Tools (_for running Firebase emulators_)
3. Install Java (_for running Firebase emulators_)

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

## How to run

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

### Performance: Bundles size

To see chunks content:

1. Build with source maps
2. Run `source-map-explorer dist/apps/datatug/main.js`
