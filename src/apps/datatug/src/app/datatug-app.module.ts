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
// import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {LoginEventsHandler, SneatAuthGuard} from '@sneat/auth';
import {CommonModule} from "@angular/common";
import {WormholeModule} from "@sneat/wormhole";
import {HelloWorldPageComponent} from "./hello-world-page.component";
import {SneatAuthRoutingModule} from "@sneat/auth-ui";
import {DatatugMenuModule} from "@sneat/datatug/menu";

// import {DatatugMenuModule} from "@sneat/datatug/menu";

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
		WormholeModule, // WormholeModule have to be imported at root module
		SneatLoggingModule,
		SneatAppModule,
		DatatugAppRoutingModule,
		// DatatugMenuModule,
	],
	providers: [
		// StatusBar,
		// SplashScreen,
		// AngularFireAuth,
		// AngularFireAuthGuard,
		SneatAuthGuard,
		SneatAuthRoutingModule,
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
