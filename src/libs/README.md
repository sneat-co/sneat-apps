# Sneat NX libraries

To generate a new library use `nx` command:

```shell
nx generate @nx/angular:library <mylibrary> --buildable

# or with PNPM alias
pnx generate @nx/angular:library <mylibrary> --buildable
```

## List of sneat libraries with brief description

- [@sneat/app](app) - provides a `AppComponentService` service that injects initializes basics services required by any
  sneat application.
- [@sneat/analytics](analytics)- provides abstraction interface to log analytics events.
- [@sneat/animations](animations) - provides basic animations.
- [@sneat/auth](auth) - provides authentication services (no UI components)
- [@sneat/auth-models](auth-models) - provides authentication models that are user by auth services & UI components.
- [@sneat/auth-ui](auth-ui) - provides authentication UI components
- [@sneat/core](core) -
