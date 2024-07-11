import { __decorate, __metadata } from "tslib";
import { NgModule } from '@angular/core';
import { browserTracingIntegration } from '@sentry/browser';
import { init } from '@sentry/angular';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { CONTACT_ROLES_BY_TYPE, getAngularFireProviders, SneatApplicationModule, } from '@sneat/app';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommunesUiModule } from '@sneat/communes-ui'; // TODO: fix this!
import { AppVersionComponent, AuthMenuItemComponent } from '@sneat/components';
import { APP_INFO, coreProviders } from '@sneat/core';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { TeamsMenuComponent } from '@sneat/team-components';
import { TeamServiceModule } from '@sneat/team-services';
import { environment } from '../environments/environment';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';
if (environment.production) {
    console.log('SneatAppModule: PRODUCTION mode');
    init({
        dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
        integrations: [browserTracingIntegration()],
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}
else {
    console.log('SneatAppModule: NOT PRODUCTION mode');
}
const appInfo = {
    appId: 'sneat',
    appTitle: 'sneat.app',
};
let SneatAppModule = class SneatAppModule {
    constructor() {
        console.log('SneatAppModule.constructor()');
    }
};
SneatAppModule = __decorate([
    NgModule({
        declarations: [SneatAppComponent, SneatAppMenuComponent],
        imports: [
            ...SneatApplicationModule.defaultSneatApplicationImports(environment),
            AppVersionComponent,
            // SneatAuthServicesModule,
            AuthMenuItemComponent,
            CommunesUiModule,
            TeamServiceModule,
            TeamsMenuComponent,
            SneatAppRoutingModule,
        ],
        providers: [
            getAngularFireProviders(environment.firebaseConfig),
            ...coreProviders,
            {
                provide: SneatApiBaseUrl,
                useValue: environment.useEmulators
                    ? 'http://localhost:4300/v0/'
                    : DefaultSneatAppApiBaseUrl,
            },
            {
                provide: RANDOM_ID_OPTIONS,
                useValue: { len: 9 },
            },
            {
                provide: APP_INFO,
                useValue: appInfo,
            },
            {
                provide: CONTACT_ROLES_BY_TYPE,
                useValue: undefined,
            },
        ],
        bootstrap: [SneatAppComponent],
        exports: [SneatAppMenuComponent],
    }),
    __metadata("design:paramtypes", [])
], SneatAppModule);
export { SneatAppModule };
//# sourceMappingURL=sneat-app.module.js.map