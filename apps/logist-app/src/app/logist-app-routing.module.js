import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
// TODO: fix & remove this eslint hint @nrwl/nx/enforce-module-boundaries
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LogistMenuComponent } from '@sneat/extensions/logist';
const routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('../pages/logist-app-home-page.module').then((m) => m.LogistAppHomePageModule),
    },
    {
        path: 'signed-out',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        outlet: 'menu',
        pathMatch: 'full',
        // loadChildren: () => import('@sneat/extensions/logist').then(m => m.ExpressTeamMenuModule),
        component: LogistMenuComponent,
    },
    {
        path: 'space/:teamType/:teamID',
        loadChildren: () => import('@sneat/extensions/logist').then((m) => m.LogistTeamRoutingModule),
    },
];
let LogistAppRoutingModule = class LogistAppRoutingModule {
};
LogistAppRoutingModule = __decorate([
    NgModule({
        imports: [
            RouterModule.forRoot(routes /*, { preloadingStrategy: PreloadAllModules }*/),
            SneatAuthRoutingModule,
            // RoutesToCommuneModule,
        ],
        exports: [RouterModule],
    })
], LogistAppRoutingModule);
export { LogistAppRoutingModule };
//# sourceMappingURL=logist-app-routing.module.js.map