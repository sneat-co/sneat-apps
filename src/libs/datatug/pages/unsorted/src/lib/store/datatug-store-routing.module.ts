import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatugStorePageComponent } from './datatug-store-page.component';
import { DatatugServicesStoreModule } from '@sneat/datatug/services/repo';

const routes: Routes = [
	{
		path: '',
		component: DatatugStorePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes), DatatugServicesStoreModule],
	exports: [RouterModule],
})
export class DatatugStorePageRoutingModule {
}
