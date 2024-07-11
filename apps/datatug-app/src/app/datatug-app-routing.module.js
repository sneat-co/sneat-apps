import { __decorate, __metadata } from "tslib";
import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { DatatugRoutingModule } from '@sneat/datatug-routes';
import { HelloWorldPageComponent } from './hello-world-page.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SneatAuthRoutingModule } from '@sneat/auth-ui';
const routes = [
    {
        path: 'hello-world',
        component: HelloWorldPageComponent,
    },
    {
        path: 'home',
        loadChildren: () => import('@sneat/datatug-pages').then((m) => m.DatatugHomePageComponent),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];
let DatatugAppRoutingModule = class DatatugAppRoutingModule {
    constructor() {
        console.log('DatatugAppRoutingModule.constructor()');
    }
};
DatatugAppRoutingModule = __decorate([
    NgModule({
        imports: [
            IonicModule,
            DatatugRoutingModule,
            RouterModule.forRoot(routes),
            SneatAuthRoutingModule,
        ],
        providers: [
            {
                provide: RouteReuseStrategy,
                useClass: IonicRouteStrategy,
            },
        ],
        exports: [RouterModule],
    }),
    __metadata("design:paramtypes", [])
], DatatugAppRoutingModule);
export { DatatugAppRoutingModule };
//# sourceMappingURL=datatug-app-routing.module.js.map