import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogistAppHomePageComponent } from './logist-app-home-page.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LogistMenuModule } from '@sneat/extensions/logist'; // TODO: HELP WANTED: find how to fix it
const routes = [
    {
        path: '',
        component: LogistAppHomePageComponent,
    },
];
let LogistAppHomePageModule = class LogistAppHomePageModule {
};
LogistAppHomePageModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            IonicModule,
            RouterModule.forChild(routes),
            LogistMenuModule,
        ],
        declarations: [LogistAppHomePageComponent],
    })
], LogistAppHomePageModule);
export { LogistAppHomePageModule };
//# sourceMappingURL=logist-app-home-page.module.js.map