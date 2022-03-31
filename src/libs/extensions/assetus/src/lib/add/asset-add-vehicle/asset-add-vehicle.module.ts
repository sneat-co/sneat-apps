import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetAddVehiclePageComponent} from './asset-add-vehicle-page.component';
import {CountrySelectorModule} from 'sneat-shared/components/country-selector/country-selector.module';

const routes: Routes = [
	{
		path: '',
		component: AssetAddVehiclePageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		CountrySelectorModule,
	],
	declarations: [AssetAddVehiclePageComponent]
})
export class AssetAddVehiclePageModule {
}
