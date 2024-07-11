import { __decorate, __metadata } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { IonSplitPane } from '@ionic/angular';
import { SneatBaseAppComponent } from '@sneat/app';
import { TopMenuService } from '@sneat/core';
import { gitHash } from '@sneat/components';
let LogistAppComponent = class LogistAppComponent extends SneatBaseAppComponent {
    getGitHash() {
        return gitHash;
    }
    constructor(topMenuService) {
        super(topMenuService);
        // window.addEventListener('hashchange', (event: HashChangeEvent) => {
        // 	// Log the state data to the console
        // 	console.log('hashchange', event.newURL);
        // 	this.ionSplitPane.disabled = location.hash === '#print';
        // });
    }
    ngAfterViewInit() {
        if (this.ionSplitPane) {
            this.ionSplitPane.disabled = location.hash === '#print';
        }
    }
};
__decorate([
    ViewChild('ionSplitPane'),
    __metadata("design:type", IonSplitPane)
], LogistAppComponent.prototype, "ionSplitPane", void 0);
LogistAppComponent = __decorate([
    Component({
        selector: 'sneat-root',
        templateUrl: './logist-app.component.html',
    }),
    __metadata("design:paramtypes", [TopMenuService])
], LogistAppComponent);
export { LogistAppComponent };
//# sourceMappingURL=logist-app.component.js.map