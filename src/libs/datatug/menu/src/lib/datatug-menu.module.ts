import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DatatugMenuComponent} from './datatug-menu.component';
import {DatatugServicesProjectModule} from '@sneat/datatug/services/project';
import {DatatugServicesStoreModule} from '@sneat/datatug/services/repo';
import {WormholeModule} from '@sneat/wormhole';
import {DatatugComponentsProjectModule} from "@sneat/datatug/components/project";
import {DatatugCoreModule} from "@sneat/datatug/core";
import {SneatAnalyticsModule} from "@sneat/analytics";
import {SneatAuthModule} from "@sneat/auth";
import {DatatugServicesBaseModule} from "@sneat/datatug/services/base";
import {DatatugServicesNavModule} from "@sneat/datatug/services/nav";
import {DatatugServicesUnsortedModule} from "@sneat/datatug/services/unsorted";
import {RouterModule} from "@angular/router";
// import {TableMetaCardModule} from '../table-meta-card/table-meta-card.module';
// import {ContextCardComponent} from '../../context/components/context-card/context-card.component';
// import {ContextCardEntityComponent} from '../../context/components/context-card-entity/context-card-entity.component';

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		//
		WormholeModule,
		SneatAnalyticsModule,
		SneatAuthModule,
		//
		DatatugCoreModule,
		DatatugServicesStoreModule,
		DatatugServicesProjectModule,
		DatatugComponentsProjectModule,
		DatatugServicesBaseModule,
		DatatugServicesNavModule,
		DatatugServicesStoreModule,
		DatatugServicesUnsortedModule,
		RouterModule,
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
