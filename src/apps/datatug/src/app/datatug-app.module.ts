import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';
import {DatatugAppComponent} from './datatug-app.component';
import {DatatugAppRoutingModule} from './datatug-app-routing.module';
import {CoreModule} from '@sneat/core';
import {SneatAppModule} from '@sneat/app';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {CommonModule} from "@angular/common";
import {WormholeModule} from "@sneat/wormhole";
import {HelloWorldPageComponent} from "./hello-world-page.component";
import {HttpClientModule} from "@angular/common/http";
import {USE_EMULATOR as USE_FIRESTORE_EMULATOR} from '@angular/fire/firestore';

@NgModule({
	declarations: [
		DatatugAppComponent,
		HelloWorldPageComponent,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebaseConfig),
		// AngularFireAnalyticsModule,
		// AngularFireAuthModule,
		// AngularFirestoreModule,
		CommonModule,
		CoreModule,
		HttpClientModule,
		WormholeModule, // WormholeModule have to be imported at root module
		SneatAppModule,
		DatatugAppRoutingModule,
		// DatatugMenuModule,
	],
	providers: [
		// StatusBar,
		// SplashScreen,
		// AngularFireAuth,
		// AngularFireAuthGuard,
		// SneatAuthGuard,
		{
			provide: USE_FIRESTORE_EMULATOR,
			useValue: environment.useEmulators ? ['localhost', 8071] : undefined,
		}
	],
	bootstrap: [
		DatatugAppComponent,
	],
})
export class DatatugAppModule {
	constructor() {
		console.log('DatatugAppModule.constructor(), environment.firebaseConfig:', environment.firebaseConfig);
	}
}
