import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
let SneatAppMyRoutingModule = class SneatAppMyRoutingModule {
};
SneatAppMyRoutingModule = __decorate([
    NgModule({
        imports: [
            RouterModule.forChild([
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'profile',
                },
                {
                    path: 'profile',
                    loadChildren: () => import('@sneat/user').then((m) => m.UserMyProfilePageRoutingModule),
                },
                {
                    path: 'spaces',
                    loadChildren: () => import('@sneat/team-pages').then((m) => m.TeamsPageModule),
                },
            ]),
        ],
    })
], SneatAppMyRoutingModule);
export { SneatAppMyRoutingModule };
//# sourceMappingURL=sneat-app-my-routing.module.js.map