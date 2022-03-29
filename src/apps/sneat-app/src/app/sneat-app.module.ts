import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { DefaultSneatApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import { initFirebase, SneatApplicationModule } from '@sneat/app';
import { SneatAuthModule } from '@sneat/auth';
import { CommunesUiModule } from '@sneat/communes/ui';
import { coreProviders } from '@sneat/core';
import { RANDOM_ID_OPTIONS, RandomModule } from '@sneat/random';
import { TeamsMenuComponentModule } from '@sneat/team/components';
import { environment } from '../environments/environment';
import { SneatAppMenuComponent } from './sneat-app-menu-component/sneat-app-menu.component';
import { SneatAppRoutingModule } from './sneat-app-routing.module';
import { SneatAppComponent } from './sneat-app.component';

initFirebase(environment.firebaseConfig);

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
		SneatAuthModule,
		CommunesUiModule,
		TeamsMenuComponentModule,
		HttpClientModule,
	],
	providers: [
		...coreProviders,
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		{
			provide: SneatApiBaseUrl,
			useValue: environment.useEmulators ? 'http://localhost:4300/v0/' : DefaultSneatApiBaseUrl,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
	],
	bootstrap: [SneatAppComponent],
	exports: [
		SneatAppMenuComponent,
	],
})
export class SneatAppModule {
}
