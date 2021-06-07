import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MyPageRoutingModule} from './my-routing.module';

import {DatatugMyPageComponent} from './page/datatug-my-page.component';
import {MyProjectsComponent} from './my-projects/my-projects.component';
import {MyStoresComponent} from './my-stores/my-stores.component';
import {MyBaseCardComponent} from './my-base-card-component';
import {DatatugServicesBaseModule} from "@sneat/datatug/services/base";
import {DatatugServicesStoreModule} from "@sneat/datatug/services/repo";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MyPageRoutingModule,
		DatatugServicesBaseModule,
		DatatugServicesStoreModule,
	],
	declarations: [
		DatatugMyPageComponent,
		MyBaseCardComponent,
		MyProjectsComponent,
		MyStoresComponent,
	]
})
export class DatatugMyPageModule {
}
