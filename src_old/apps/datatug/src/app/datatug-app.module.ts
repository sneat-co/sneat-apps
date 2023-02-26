import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { APP_INFO, coreProviders, IAppInfo } from '@sneat/core';
import { DatatugAppComponent } from './datatug-app.component';
import { DatatugAppRoutingModule } from './datatug-app-routing.module';
// import { CoreModule } from '@sneat/core';
import { EnvConfigToken, initFirebase, SneatApplicationModule } from '@sneat/app';
import { CommonModule } from '@angular/common';
import { WormholeModule } from '@sneat/wormhole';
import { HelloWorldPageComponent } from './hello-world-page.component';
import { HttpClientModule } from '@angular/common/http';
// import {USE_EMULATOR as USE_FIRESTORE_EMULATOR} from '@angular/fire/firestore';
// import {USE_EMULATOR as USE_FIREBASE_AUTH_EMULATOR} from '@angular/fire/auth';
// Issue: https://github.com/angular/angularfire/issues/2656
// Bug: https://github.com/firebase/firebase-js-sdk/issues/4110
// Workaround: https://stackoverflow.com/questions/65025005/angularfireauth-emulator-login-is-lost-on-page-reload
import { SneatAuthServicesModule } from '@sneat/auth';
import { RANDOM_ID_OPTIONS, RandomModule } from '@sneat/random';
// import { GuiGridModule } from '@generic-ui/ngx-grid';

initFirebase(environment.firebaseConfig);

// ***********************************************************************************************

const appInfo: IAppInfo = {
	appId: 'sneat',
	appTitle: 'sneat.app',
};

@NgModule({
	declarations: [DatatugAppComponent, HelloWorldPageComponent],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		// AngularFireAnalyticsModule,
		// AngularFireAuthModule,
		// AngularFirestoreModule,
		CommonModule,
		// CoreModule,
		HttpClientModule,
		// GuiGridModule,
		RandomModule,
		WormholeModule, // WormholeModule have to be imported at root module
		SneatApplicationModule,
		SneatAuthServicesModule,
		DatatugAppRoutingModule,
		// DatatugMenuModule,
	],
	providers: [
		...coreProviders,
		{
			provide: APP_INFO,
			useValue: appInfo,
		},

		// StatusBar,
		// SplashScreen,
		// AngularFireAuth,
		// AngularFireAuthGuard,
		// SneatAuthGuard,
		// {
		// 	provide: USE_FIRESTORE_EMULATOR,
		// 	useValue: environment.useEmulators ? ['localhost', 8080] : undefined,
		// },
		// {
		// 	provide: USE_FIREBASE_AUTH_EMULATOR,
		// 	useValue: environment.useEmulators ? ['localhost', 9099] : undefined,
		// },
		{
			provide: EnvConfigToken,
			useValue: environment,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
	],
	bootstrap: [DatatugAppComponent],
})
export class DatatugAppModule {
	constructor() {
		console.log('DatatugAppModule.constructor()');
	}
}
