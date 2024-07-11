import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { TopMenuService } from '@sneat/core';
let SneatAppComponent = class SneatAppComponent {
    constructor(topMenuService) {
        this.topMenuService = topMenuService;
    }
};
SneatAppComponent = __decorate([
    Component({
        selector: 'sneat-app-root',
        templateUrl: 'sneat-app.component.html',
    }),
    __metadata("design:paramtypes", [TopMenuService])
], SneatAppComponent);
export { SneatAppComponent };
//# sourceMappingURL=sneat-app.component.js.map