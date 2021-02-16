# CLI commands

At the moment we are using `pnpm` as a package manager.

## To install pnpm
```
> npm i -g pnpm
```


## To clone the repository
```
> git clone https://github.com/sneat-team/sneat-apps.git apps
> cd apps
```
## To create NX workspace (not needed by contributors)
```
pnpx create-nx-workspace --preset=angular --packageManager=pnpm
pnpm add --save-dev --exact @nxtend/ionic-angular
nx generate @nxtend/ionic-angular:init
```

## To create an Ionic app
```
pnpx nx generate @nxtend/ionic-angular:application <APP_NAME>
```

## To create an Angular library 
```
pnpx nx g @nrwl/angular:lib <LIB_NAME> [--publishable]
```

## To create an Angular component
```
pnpx nx g component <COMP_NAME> --project=<PROJ> --export
```
