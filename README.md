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

# Setting up development environment

If you want to contribute to this open source project you can 
read instructions on how to set up local dev environment in [README-DEV-SETUP.md](README-DEV-SETUP.md). 

## Concepts
- `Team`
  - `Squad`
  - `Commune`



## Known issues

### Dependencies

#### Firebase stuck @ v. 8.6.1
There is a [known issue](https://github.com/firebase/firebase-js-sdk/issues/4932)
with Firebase >= 8.6.2 regards authentication
and Firestore rules
