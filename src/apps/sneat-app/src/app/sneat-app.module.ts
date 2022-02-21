import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { SneatAppComponent } from "./sneat-app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CommunesUiModule, RoutesToCommuneModule } from "@sneat/communes/ui";
import { SneatApplicationModule } from "@sneat/app";
import { SneatAppMenuComponent } from "./sneat-app-menu-component/sneat-app-menu.component";
import { SneatAuthModule } from "@sneat/auth";

@NgModule({
	declarations: [
		SneatAppComponent,
		SneatAppMenuComponent,
	],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
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
