import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
let FolderPage = class FolderPage {
    activatedRoute;
    folder;
    constructor(activatedRoute) {
        this.activatedRoute = activatedRoute;
    }
    ngOnInit() {
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    }
};
FolderPage = __decorate([
    Component({
        selector: 'sneat-folder',
        templateUrl: './folder.page.html',
        styleUrls: ['./folder.page.scss'],
    }),
    __metadata("design:paramtypes", [ActivatedRoute])
], FolderPage);
export { FolderPage };
//# sourceMappingURL=folder.page.js.map