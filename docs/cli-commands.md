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
pnpx nx g @nrwl/angular:lib <LIB_NAME> [--publishable | --buildable] [--directory] <FOLDER_NAME>
```
Examples:
```
pnpx nx g @nrwl/angular:lib Home --directory datatug/pages
pnpx nx g @nrwl/angular:lib logging --publishable --importPath="@sneat/logging" --tags="scope:public,type:util,target:all"
```
To support auto-imports in JetBrains IDE make sure to manually add `@sneat/<LIB_NAME>/*` path duplicate entry for libraries into `tsconfig.base.json`:
```
{
  "compilerOptions": {
    "paths": {
      "@sneat/core": ["libs/core/src/index.ts"],
      "@sneat/core/*": ["libs/core/src/index.ts"]
    }
  },
}
```

## To make existing library to be buildable
```
pnpx nx g @trellisorg/make-buildable:migrate
```

## To create an Angular component
```
pnpx nx g component <COMP_NAME> --project=<PROJ> --export
```
