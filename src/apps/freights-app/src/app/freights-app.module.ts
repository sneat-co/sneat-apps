import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FreightsAppRoutingModule } from './freights-app-routing.module';

import { FreightsAppComponent } from './freights-app.component';

@NgModule({
	declarations: [
		FreightsAppComponent,
	],
	imports: [
		BrowserModule,
		IonicModule,
		FreightsAppRoutingModule,
	],
	providers: [],
	bootstrap: [FreightsAppComponent],
})
export class FreightsAppModule {
}
