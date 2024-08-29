import { NgModule } from '@angular/core';
import { browserTracingIntegration } from '@sentry/browser';
import { init } from '@sentry/angular';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import {
	CONTACT_ROLES_BY_TYPE,
	getAngularFireProviders,
	SneatApplicationModule,
} from '@sneat/app';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CommunesUiModule } from '@sneat/communes-ui'; // TODO: fix this!
import { AppVersionComponent, AuthMenuItemComponent } from '@sneat/components';
import { APP_INFO, coreProviders, IAppInfo } from '@sneat/core';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { SpacesMenuComponent } from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
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
		AppVersionComponent,
		// SneatAuthServicesModule,
		AuthMenuItemComponent,
		CommunesUiModule,
		SpaceServiceModule,
		SpacesMenuComponent,
		SneatAppRoutingModule,
	],
	providers: [
		getAngularFireProviders(environment.firebaseConfig),
		...coreProviders,
		{
			provide: SneatApiBaseUrl,
			useValue: environment.useNgrok
				? `//${location.host}/v0/`
				: environment.useEmulators
					? 'https://local-api.sneat.ws/v0/' // 'http://localhost:4300/v0/'
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
})
export class SneatAppModule {
	constructor() {
		console.log('SneatAppModule.constructor()');
	}
}
