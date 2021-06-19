import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorePageComponent} from './store-page.component';
import {IonicModule} from '@ionic/angular';
import {DatatugServicesStoreModule} from "@sneat/datatug/services/repo";

const routes: Routes = [
	{
		path: '',
		component: StorePageComponent,
	},
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		DatatugServicesStoreModule,
	],
	exports: [RouterModule],
})
export class StorePageRoutingModule {
}
