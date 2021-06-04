import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {DatatugMenuComponent} from './datatug-menu.component';
import {DatatugServicesProjectModule} from '@sneat/datatug/services/project';
import {DatatugServicesStoreModule} from '@sneat/datatug/services/repo';
import {WormholeModule} from '@sneat/wormhole';
import {DatatugComponentsProjectModule} from "@sneat/datatug/components/project";
// import {TableMetaCardModule} from '../table-meta-card/table-meta-card.module';
// import {ContextCardComponent} from '../../context/components/context-card/context-card.component';
// import {ContextCardEntityComponent} from '../../context/components/context-card-entity/context-card-entity.component';

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule,
		DatatugServicesStoreModule,
		DatatugServicesProjectModule,
		WormholeModule, // WormholeModule have to be imported at root module
		DatatugComponentsProjectModule,
		// DatatugServicesModule,
		// TableMetaCardModule,
	],
	declarations: [
		DatatugMenuComponent,
		// ContextCardComponent,
		// ContextCardEntityComponent,
	],
	exports: [
		DatatugMenuComponent,
	],
})
export class DatatugMenuModule {
	constructor() {
		console.log('DatatugMenuModule.constructor()');
	}
}
