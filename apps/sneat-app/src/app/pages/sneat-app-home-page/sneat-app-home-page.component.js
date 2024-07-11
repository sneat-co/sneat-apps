import { __decorate, __metadata, __param } from "tslib";
import { CommonModule } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAuthStateService } from '@sneat/auth-core';
import { UserCountryComponent } from '@sneat/components';
import { ErrorLogger } from '@sneat/logging';
import { TeamsListComponent } from '@sneat/team-components';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { ForTeamTypeCardComponent } from '../../components/for-team-type-card.component';
import { ForEducatorsComponent } from './for-educators.component';
import { ForFamiliesComponent } from './for-families.component';
import { ForWorkComponent } from './for-work.component';
let SneatAppHomePageComponent = class SneatAppHomePageComponent extends SneatBaseComponent {
    constructor(errorLogger, authStateService, router) {
        super('SneatAppHomePageComponent', errorLogger);
        this.router = router;
        this.authStatus = signal(undefined);
        authStateService.authState.pipe(takeUntil(this.destroyed$)).subscribe({
            next: (authState) => {
                this.authStatus.set(authState.status);
                if (authState.status === 'notAuthenticated') {
                    router
                        .navigate(['login'])
                        .catch(errorLogger.logErrorHandler('Failed to navigate to login page'));
                }
            },
        });
    }
};
SneatAppHomePageComponent = __decorate([
    Component({
        // Do not make it standalone component,
        // as it requires few other components specific just to this page
        selector: 'sneat-sneat-app-home-page',
        templateUrl: './sneat-app-home-page.component.html',
        standalone: true,
        imports: [
            CommonModule,
            IonicModule,
            RouterModule,
            TeamsListComponent,
            UserCountryComponent,
            ForTeamTypeCardComponent,
            ForFamiliesComponent,
            ForEducatorsComponent,
            ForWorkComponent,
        ],
    }),
    __param(0, Inject(ErrorLogger)),
    __metadata("design:paramtypes", [Object, SneatAuthStateService,
        Router])
], SneatAppHomePageComponent);
export { SneatAppHomePageComponent };
//# sourceMappingURL=sneat-app-home-page.component.js.map