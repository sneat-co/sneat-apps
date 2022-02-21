import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { SneatAppComponent } from "./sneat-app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CommunesUiModule, RoutesToCommuneModule } from "@sneat/communes/ui";
import { SneatLoggingModule } from "@sneat/logging";
import { SneatApplicationModule } from "@sneat/app";

@NgModule({
	declarations: [SneatAppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		SneatApplicationModule,
		CommunesUiModule,
	],
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
	bootstrap: [SneatAppComponent],
})
export class SneatAppModule {
}
