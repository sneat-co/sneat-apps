import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule } from '@sneat/components';

import { AssetAddVehicleComponent } from './asset-add-vehicle/asset-add-vehicle.component';

const exports = [AssetAddVehicleComponent];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorModule,
		SelectFromListModule,
	],
	declarations: [...exports],
	exports,
})
export class AddAssetComponentsModule {
}
