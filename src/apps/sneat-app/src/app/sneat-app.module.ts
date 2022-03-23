import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SneatAppComponent } from "./sneat-app.component";
import { SneatAppRoutingModule } from "./sneat-app-routing.module";
import { CommunesUiModule } from "@sneat/communes/ui";
import { initFirebase, SneatApplicationModule } from "@sneat/app";
import { SneatAppMenuComponent } from "./sneat-app-menu-component/sneat-app-menu.component";
import { SneatAuthModule } from "@sneat/auth";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { TeamMenuComponentModule } from "@sneat/team/components";
import { RANDOM_ID_OPTIONS, RandomModule } from "@sneat/random";
import { HttpClientModule } from "@angular/common/http";

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
		RandomModule,
		SneatAppRoutingModule,
		SneatApplicationModule,
		SneatAuthModule,
		CommunesUiModule,
		TeamMenuComponentModule,
		HttpClientModule,
	],
	providers: [
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
	],
	bootstrap: [SneatAppComponent],
})
export class SneatAppModule {
}
