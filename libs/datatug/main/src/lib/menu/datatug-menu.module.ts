import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SneatAnalyticsModule } from '@sneat/core';
import { AuthMenuItemModule } from '@sneat/auth-core';
import { WormholeModule } from '@sneat/wormhole';
import { DatatugServicesProjectModule } from '../services/project/datatug-services-project.module';
import { DatatugServicesStoreModule } from '../services/repo/datatug-services-store.module';
import { DatatugMenuComponent } from './datatug-menu.component';
import { MenuEnvSelectorComponent } from './menu-env-selector.component';
import { MenuProjectSelectorComponent } from './menu-project-selector.component';
import { MenuStoreSelectorComponent } from './menu-store-selector.component';
import { DatatugCoreModule } from '../core/datatug-core.module';

@NgModule({
	imports: [
		FormsModule,
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
