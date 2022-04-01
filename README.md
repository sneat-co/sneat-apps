# [github.com/sneat-co/sneat-apps](https://github.com/sneat-co/sneat-apps)

A suit of open source apps that help in work & personal life.

## Apps for work
- **Sneat.team** - provides authentication & org structure for below apps:
    - [DataTug](src/apps/datatug) - SQL & HTTP queries workbench
    - [ScrumSpace](src/apps/scrumspace) - daily scrums & retrospectives for agile teams 
    - [IssueNumber.One](src/apps/issuenumberone) - facilitates continuous **focused** feedback & improvements


## Apps for family & personal life 
- to be listed here

## Tech stack
- [TypeScript](https://www.typescriptlang.org/) - typed JavaScript at Any Scale
- [Angular](https://angular.io/) - the modern web developer's platform
- [Ionic Framework](https://ionicframework.com/) - an open source mobile UI toolkit for building high quality, cross-platform native and web app experiences.
- [Capacitor](https://capacitorjs.com/) - a cross-platform native runtime for web apps.
- [nx](https://nx.dev/) by [Nrwl](https://nrwl.io/) - extensible dev tools for monorepos


## Concepts
- `Team`
  - `Squad`
  - `Commune`

## How to run

Preferable way is not to use global `nx` but to use:
```shell
pnpm run nx serve <APP_NAME>
```

Shorter way:
```shell
pnpx nx serve <APP_NAME>
```

To make it even shorter first create a shortcut:
```shell
alias pnx="pnpm run nx --"
```

Then run as:
```shell
pnx serve <APP_NAME>
```

### Run with source maps

For some reason the serve is running with enabled optimization and no source maps.
It results in troubles with debugging.

Here is how to run dev server properly for datatug app:

```shell
pnx serve datatug --optimization=false --sourceMap=true
```


## Troubleshooting

### Performance: Bundles size

To see chunks content:

1. Build with source maps
2. Run `source-map-explorer dist/apps/datatug/main.js`

## Known issues

### Dependencies

#### Firebase stuck @ v. 8.6.1
There is a [known issue](https://github.com/firebase/firebase-js-sdk/issues/4932)
with Firebase >= 8.6.2 regards authentication
and Firestore rules
