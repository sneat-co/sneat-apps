# Project structure

- [apps](apps)
  - [sneat-app](../apps/sneat-app) - a super app that includes most of the modules (but not all).
  - [datatug-app](../apps/datatug-app) - an app for working with data.
  - [logist-app](../apps/logist-app) - an app for logistics and transportation
- [libs](../libs) - libraries that can be imported by other libraries and apps.
  - [api](../libs/api/README.md) - a collection of APIs that can be used by apps and libraries.
  - [auth](../libs/auth/README.md) - libraries for authentication and authorization.
    - [auth-core](../libs/auth/core/README.md) - core authentication library.
    - [auth-models](../libs/auth/models/README.md) - models for authentication.
    - [auth-ui](../libs/auth/ui/README.md) - UI components for authentication
  - [extensions](../libs/extensions/README.md) - a collection of extensions that can be used in various apps, mainly in [sneat-app](../apps/).
    - [assetus](../libs/extensions/assetus/README.md)
  - [datatug](../libs/datatug/README.md) - libraries for DataTug.app.
    - [datatug](../libs/datatug/main/README.md) - the main library for DataTug.app.
