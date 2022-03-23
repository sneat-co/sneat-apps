import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatatugHomePageComponent } from './datatug-home-page.component';

import { HomePageRoutingModule } from './home-routing.module';
import { CoreModule } from '@sneat/core';
import { WormholeModule } from '@sneat/wormhole';
import { MyStoresComponent } from './my-stores/my-stores.component';
import { DatatugServicesBaseModule } from '@sneat/datatug/services/base';
import { DatatugServicesStoreModule } from '@sneat/datatug/services/repo';
import { MyDatatugProjectsComponent } from './my-projects/my-datatug-projects.component';
import { LoadingItemsComponent } from './loading-items-component';
import { NewProjectFormModule } from '@sneat/datatug/project';

// import { GuiGridModule } from '@generic-ui/ngx-grid';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HomePageRoutingModule,
		CoreModule,
		WormholeModule,
		DatatugServicesBaseModule,
		DatatugServicesStoreModule,
		NewProjectFormModule,
		// GuiGridModule,
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
