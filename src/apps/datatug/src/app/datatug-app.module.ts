import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {DatatugAppComponent} from './datatug-app.component';
import {DatatugAppRoutingModule} from './datatug-app-routing.module';
import {CoreModule} from '@sneat/core';
import {SneatLoggingModule} from '@sneat/logging';
import {SneatAnalyticsModule} from '@sneat/analytics';
import {SneatAppModule} from '@sneat/app';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {LoginEventsHandler, SneatAuthGuard, SneatAuthModule} from '@sneat/auth';
import {SneatAuthRoutingModule} from '../../../../libs/auth/src/lib/sneat-auth-routing.module';
import {DatatugMenuSignedModule} from './datatug-menu-signed/datatug-menu-signed.module';
import {DatatugMenuUnsignedModule} from './datatug-menu-unsigned/datatug-menu-unsigned.module';
import {DatatugCoreModule} from '@sneat/datatug/core';

@NgModule({
  declarations: [DatatugAppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    // AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    DatatugCoreModule,
    DatatugAppRoutingModule,
    CoreModule,
    SneatAppModule,
    SneatLoggingModule,
    SneatAnalyticsModule,
    SneatAuthModule,
    SneatAuthRoutingModule,
    DatatugMenuSignedModule,
    DatatugMenuUnsignedModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFireAuthGuard,
    SneatAuthGuard,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: LoginEventsHandler, useValue: {
        onLoggedIn: () => {
          console.log('LoginEventsHandler: logged in')
        }
      }
    },
  ],
  bootstrap: [DatatugAppComponent],
})
export class DatatugAppModule {
  constructor() {
  }
}
