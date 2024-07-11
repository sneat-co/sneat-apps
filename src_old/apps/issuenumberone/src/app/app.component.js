import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
let AppComponent = class AppComponent {
    platform;
    constructor(platform) {
        this.platform = platform;
        this.initializeApp();
    }
    initializeApp() {
        this.platform.ready().then(() => {
            // this.statusBar.styleDefault();
            // this.splashScreen.hide();
        });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'sneat-root',
        templateUrl: 'app.component.html',
    }),
    __metadata("design:paramtypes", [Platform])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map