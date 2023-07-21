import { NgModule } from '@angular/core';
import { BrowserTracing } from '@sentry/browser';
import { init, instrumentAngularRouting } from '@sentry/angular-ivy';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { ImportFirebaseModules, SneatApplicationModule } from '@sneat/app';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommunesUiModule } from '@sneat/communes/ui';
import { AppVersionComponent, AuthMenuItemModule } from '@sneat/components';
import { APP_INFO, coreProviders, IAppInfo } from '@sneat/core';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { environment } from '../environments/environment';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';

if (environment.production) {
	console.log('SneatAppModule: PRODUCTION mode');
	init({
		dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
		integrations: [
			new BrowserTracing({
				// shouldCreateSpanForRequest(url: string): boolean {
				// 	return url.startsWith('https://sneat.app');
				// },
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

const appInfo: IAppInfo = {
	appId: 'sneat',
	appTitle: 'sneat.app',
};

@NgModule({
	declarations: [SneatAppComponent, SneatAppMenuComponent],
	imports: [
		...SneatApplicationModule.defaultSneatApplicationImports(environment),
		ImportFirebaseModules(environment.firebaseConfig),
		AppVersionComponent,
		// SneatAuthServicesModule,
		AuthMenuItemModule,
		CommunesUiModule,
		TeamsMenuComponentModule,
		SneatAppRoutingModule,
	],
	providers: [
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
	],
	bootstrap: [SneatAppComponent],
	exports: [SneatAppMenuComponent],
})
export class SneatAppModule {
	constructor() {
		console.log('SneatAppModule.constructor()');
	}
}
