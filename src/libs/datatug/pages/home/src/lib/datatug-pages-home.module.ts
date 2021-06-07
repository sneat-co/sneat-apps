import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {DatatugHomePageComponent} from './datatug-home-page.component';

import {HomePageRoutingModule} from './home-routing.module';
import {CoreModule} from '@sneat/core';
import {WormholeModule} from "@sneat/wormhole";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		CoreModule,
		WormholeModule,
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
