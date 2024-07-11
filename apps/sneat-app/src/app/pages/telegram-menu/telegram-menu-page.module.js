import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TelegramMenuPageComponent } from './telegram-menu-page.component';
const routes = [
    {
        path: '',
        component: TelegramMenuPageComponent,
    },
];
let TelegramMenuPageModule = class TelegramMenuPageModule {
};
TelegramMenuPageModule = __decorate([
    NgModule({
        imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
        declarations: [TelegramMenuPageComponent],
    })
], TelegramMenuPageModule);
export { TelegramMenuPageModule };
//# sourceMappingURL=telegram-menu-page.module.js.map