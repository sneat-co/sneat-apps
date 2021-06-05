import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {DatatugAppComponent} from './datatug-app.component';
import {DatatugAppRoutingModule} from './datatug-app-routing.module';
import {CoreModule} from '@sneat/core';
import {SneatLoggingModule} from '@sneat/logging';
import {SneatAppModule} from '@sneat/app';
// import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {LoginEventsHandler, SneatAuthGuard, SneatAuthModule, SneatAuthRoutingModule} from '@sneat/auth';
import {CommonModule} from "@angular/common";
import {WormholeModule} from "@sneat/wormhole";
import {HelloWorldPageComponent} from "./hello-world-page.component";

@NgModule({
	declarations: [
		DatatugAppComponent,
		HelloWorldPageComponent,
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		DatatugAppRoutingModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		// AngularFireAnalyticsModule,
		// AngularFireAuthModule,
		// AngularFirestoreModule,
		CommonModule,
		CoreModule,
		WormholeModule, // WormholeModule have to be imported at root module
		SneatLoggingModule,
		SneatAppModule,
	],
	providers: [
		// StatusBar,
		// SplashScreen,
		// AngularFireAuth,
		// AngularFireAuthGuard,
		SneatAuthGuard,
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		{
			provide: LoginEventsHandler, useValue: {
				onLoggedIn: () => {
					console.log('LoginEventsHandler: logged in')
				}
			}
		},
	],
	bootstrap: [
		DatatugAppComponent,
	],
})
export class DatatugAppModule {
	constructor() {
		console.log('DatatugAppModule.constructor()');
	}
}
