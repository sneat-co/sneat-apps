import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { SneatAuthStateService } from '@sneat/auth-core';
let SneatAppMenuComponent = class SneatAppMenuComponent {
    constructor(authStateService) {
        this.authStateService = authStateService;
        authStateService.authState.subscribe((authState) => {
            this.authState = authState;
        });
    }
};
SneatAppMenuComponent = __decorate([
    Component({
        selector: 'sneat-app-menu',
        templateUrl: './sneat-app-menu.component.html',
    }),
    __metadata("design:paramtypes", [SneatAuthStateService])
], SneatAppMenuComponent);
export { SneatAppMenuComponent };
//# sourceMappingURL=sneat-app-menu.component.js.map