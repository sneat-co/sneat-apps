import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FolderPage } from './folder.page';
const routes = [
    {
        path: '',
        component: FolderPage,
    },
];
let FolderPageRoutingModule = class FolderPageRoutingModule {
};
FolderPageRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })
], FolderPageRoutingModule);
export { FolderPageRoutingModule };
//# sourceMappingURL=folder-routing.module.js.map