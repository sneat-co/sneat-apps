import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAnalyticsModule } from '@sneat/core';
import { AuthMenuItemModule } from '@sneat/auth-core';
import { DatatugComponentsProjectModule } from '@sneat/datatug-components-project';
import { DatatugCoreModule } from '@sneat/datatug-core';
import { NewProjectFormModule } from '@sneat/datatug-project';
import { DatatugServicesBaseModule } from '@sneat/datatug-services-base';
import { DatatugServicesNavModule } from '@sneat/datatug-services-nav';
import { DatatugServicesProjectModule } from '@sneat/datatug-services-project';
import { DatatugServicesStoreModule } from '@sneat/datatug-services-repo';
import { DatatugServicesUnsortedModule } from '@sneat/datatug-services-unsorted';
import { WormholeModule } from '@sneat/wormhole';
import { DatatugMenuComponent } from './datatug-menu.component';
import { MenuEnvSelectorComponent } from './menu-env-selector.component';
import { MenuProjectSelectorComponent } from './menu-project-selector.component';
import { MenuStoreSelectorComponent } from './menu-store-selector.component';

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule.forChild([
			{ path: '', component: DatatugMenuComponent, outlet: 'menu' },
		]),
		//
		WormholeModule,
		SneatAnalyticsModule,
		AuthMenuItemModule,
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
	exports: [DatatugMenuComponent],
})
export class DatatugMenuModule {
	constructor() {
		console.log('DatatugMenuModule.constructor()');
	}
}
