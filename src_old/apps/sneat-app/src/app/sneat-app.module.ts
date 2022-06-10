import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { init, instrumentAngularRouting } from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { initFirebase, SneatApplicationModule } from '@sneat/app';
import { AuthMenuItemModule, SneatAuthServicesModule } from '@sneat/auth';
import { CommunesUiModule } from '@sneat/communes/ui';
import { APP_INFO, coreProviders, IAppInfo } from '@sneat/core';
import { RANDOM_ID_OPTIONS, RandomModule } from '@sneat/random';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { environment } from '../environments/environment';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';

if (environment.production) {
	console.log('SneatAppModule: PRODUCTION mode');
	init({
		dsn: "https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241",
		integrations: [
			new BrowserTracing({
				tracingOrigins: ["localhost", "https://sneat.app"],
				routingInstrumentation: instrumentAngularRouting,
			}),
		],

		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
} else {
	console.log('SneatAppModule: NOT PRODUCTION mode');
}

initFirebase(environment.firebaseConfig);

const appInfo: IAppInfo = {
	appId: 'sneat',
	appTitle: 'sneat.app',
};

@NgModule({
    declarations: [
        SneatAppComponent,
        SneatAppMenuComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        RandomModule,
        SneatAppRoutingModule,
        SneatApplicationModule,
        SneatAuthServicesModule,
        AuthMenuItemModule,
        CommunesUiModule,
        TeamsMenuComponentModule,
        HttpClientModule,
    ],
    providers: [
        ...coreProviders,
        {
            provide: SneatApiBaseUrl,
            useValue: environment.useEmulators ? 'http://localhost:4300/v0/' : DefaultSneatAppApiBaseUrl,
        },
        {
            provide: RANDOM_ID_OPTIONS,
            useValue: { len: 9 },
        },
        {
            provide: APP_INFO,
            useValue: appInfo,
        },
    ],
    bootstrap: [SneatAppComponent],
    exports: [
        SneatAppMenuComponent,
    ]
})
export class SneatAppModule {
	constructor() {
		console.log('SneatAppModule.constructor()');
	}
}
