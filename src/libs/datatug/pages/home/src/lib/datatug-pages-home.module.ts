import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {DatatugHomePageComponent} from './datatug-home-page.component';

import {HomePageRoutingModule} from './home-routing.module';
import {CoreModule} from '@sneat/core';
import {WormholeModule} from "@sneat/wormhole";
import {DatatugMenuModule} from "../../../../menu/src/lib/datatug-menu.module";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		CoreModule,
		WormholeModule,
		DatatugMenuModule,
	],
	declarations: [
		DatatugHomePageComponent,
	],
})
export class DatatugPagesHomeModule {
	constructor() {
		console.log('DatatugPagesHomeModule.constructor()');
	}
}
