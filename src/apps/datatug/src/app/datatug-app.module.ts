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
// import {USE_EMULATOR as USE_FIRESTORE_EMULATOR} from '@angular/fire/firestore';
// import {USE_EMULATOR as USE_FIREBASE_AUTH_EMULATOR} from '@angular/fire/auth';


// Issue: https://github.com/angular/angularfire/issues/2656
// Bug: https://github.com/firebase/firebase-js-sdk/issues/4110
// Workaround: https://stackoverflow.com/questions/65025005/angularfireauth-emulator-login-is-lost-on-page-reload
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {SneatAuthModule} from '@sneat/auth';

const firebaseApp = firebase.initializeApp(environment.firebaseConfig);
if (environment.useEmulators) {
	firebaseApp.auth().useEmulator('http://localhost:9099');
	firebaseApp.firestore().useEmulator('localhost', 8080);
}
// ***********************************************************************************************

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
		SneatAuthModule,
		DatatugAppRoutingModule,
		// DatatugMenuModule,
	],
	providers: [
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
