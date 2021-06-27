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
import {DatatugServicesBaseModule} from "@sneat/datatug/services/base";
import {DatatugServicesNavModule} from "@sneat/datatug/services/nav";
import {DatatugServicesUnsortedModule} from "@sneat/datatug/services/unsorted";
import {RouterModule} from "@angular/router";
import {MenuProjectSelectorComponent} from "./menu-project-selector.component";
import {MenuEnvSelectorComponent} from "./menu-env-selector.component";
import {MenuStoreSelectorComponent} from "./menu-store-selector.component";
import {NewProjectFormModule} from '@sneat/datatug/project';

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule.forChild([{path: '', component: DatatugMenuComponent, outlet: 'menu'}]),
		//
		WormholeModule,
		SneatAnalyticsModule,
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
		NewProjectFormModule,
	],
	declarations: [
		DatatugMenuComponent,
		MenuProjectSelectorComponent,
		MenuEnvSelectorComponent,
		MenuStoreSelectorComponent,
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
