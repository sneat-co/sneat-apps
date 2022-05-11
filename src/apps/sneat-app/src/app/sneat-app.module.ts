import { HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
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
import { TraceService, createErrorHandler } from '@sentry/angular';
import { APP_INITIALIZER } from '@angular/core';

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
	entryComponents: [],
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
	],
})
export class SneatAppModule {
}
