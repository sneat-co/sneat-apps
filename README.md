# [github.com/sneat-co/sneat-apps](https://github.com/sneat-co/sneat-apps)

A suit of open source apps that help in work & personal life.

## Apps for family & personal life
 - [Sneat.app] - a "super" family app that saves you time & money.
   - Members
   - Schedule / calendar
   - Contacts
   - Assets management (details, log book, renewal reminders, etc.)
   - Budgeting (integrated with assets management)
   - Lists: ToDo, ToBuy, ToWatch, etc.
   - etc.


[//]: # (## Apps for work)

[//]: # (- **Sneat.team** - provides authentication & org structure for below apps:)

[//]: # (    - [DataTug]&#40;src/apps/datatug&#41; - SQL & HTTP queries workbench)

[//]: # (    - [ScrumSpace]&#40;src/apps/scrumspace&#41; - daily scrums & retrospectives for agile teams )

[//]: # (    - [IssueNumber.One]&#40;src/apps/issuenumberone&#41; - facilitates continuous **focused** feedback & improvements)

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
