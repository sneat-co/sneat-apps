# Code generation
To generate new apps & libraries use `nx` command.

## To generate new Angular library
Run next command:
```shell
pnx g lib <LIB_NAME> --buildable=true --publishable=true --importPath=@sneat/<LIB_NAME>
```


## To generate new Ionic app
Run next command:
```shell
nx generate @nxtend/ionic-angular:app my-app
```

## TO generate new component:
```shell
pnx generate @nrwl/angular:component
```

More on how to use NX with Ionic here: https://ionicframework.com/blog/ionic-angular-monorepos-with-nx/
