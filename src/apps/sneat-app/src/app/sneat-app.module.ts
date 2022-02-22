import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SneatAppComponent } from "./sneat-app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CommunesUiModule } from "@sneat/communes/ui";
import { initFirebase, SneatApplicationModule } from "@sneat/app";
import { SneatAppMenuComponent } from "./sneat-app-menu-component/sneat-app-menu.component";
import { SneatAuthModule } from "@sneat/auth";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";

initFirebase(environment.firebaseConfig);

@NgModule({
	declarations: [
		SneatAppComponent,
		SneatAppMenuComponent,
	],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AppRoutingModule,
		SneatApplicationModule,
		SneatAuthModule,
		CommunesUiModule,
	],
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
	bootstrap: [SneatAppComponent],
})
export class SneatAppModule {
}
