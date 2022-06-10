import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CopyrightComponentModule } from '@sneat/components';
import { NewProjectFormModule } from '@sneat/datatug/project';
import { DatatugServicesBaseModule } from '@sneat/datatug/services/base';
import { DatatugServicesStoreModule } from '@sneat/datatug/services/repo';
import { WormholeModule } from '@sneat/wormhole';
import { DatatugHomePageComponent } from './datatug-home-page.component';

import { HomePageRoutingModule } from './home-routing.module';
import { LoadingItemsComponent } from './loading-items-component';
import { MyDatatugProjectsComponent } from './my-projects/my-datatug-projects.component';
import { MyStoresComponent } from './my-stores/my-stores.component';

// import { GuiGridModule } from '@generic-ui/ngx-grid';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		// CoreModule,
		WormholeModule,
		DatatugServicesBaseModule,
		DatatugServicesStoreModule,
		NewProjectFormModule,
		// GuiGridModule,
		CopyrightComponentModule,
	],
	declarations: [
		DatatugHomePageComponent,
		LoadingItemsComponent,
		MyDatatugProjectsComponent,
		MyStoresComponent,
	],
})
export class DatatugPagesHomeModule {
	constructor() {
		console.log('DatatugPagesHomeModule.constructor()');
	}
}
