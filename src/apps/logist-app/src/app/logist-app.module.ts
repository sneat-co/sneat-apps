import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { ImportFirebaseModules, SneatApplicationModule } from '@sneat/app';
import { AuthMenuItemModule, SneatAuthServicesModule } from '@sneat/auth';
import { CommunesUiModule } from '@sneat/communes/ui';
import { APP_INFO, coreProviders, IAppInfo } from '@sneat/core';
import { initSentry } from '@sneat/logging';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { environment } from '../environments/environment';
import { LogistAppRoutingModule } from './logist-app-routing.module';

import { LogistAppComponent } from './logist-app.component';

initSentry();

// initFirebase(environment.firebaseConfig);

const appInfo: IAppInfo = {
	appId: 'logist',
	appTitle: 'Logistus.app',
	requiredTeamType: 'company',
};

console.log('logist-app.module: environment:', environment);

const firebaseModules = ImportFirebaseModules(environment.firebaseConfig);

console.log('firebaseModules', firebaseModules);

@NgModule({
	imports: [
		...firebaseModules,
		BrowserAnimationsModule,
		SneatApplicationModule.defaultSneatApplicationImports(environment),
		SneatAuthServicesModule,
		AuthMenuItemModule,
		CommunesUiModule,
		TeamsMenuComponentModule,
		LogistAppRoutingModule,
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
	declarations: [
		LogistAppComponent,
	],
	bootstrap: [LogistAppComponent],
})
export class LogistAppModule {
}
