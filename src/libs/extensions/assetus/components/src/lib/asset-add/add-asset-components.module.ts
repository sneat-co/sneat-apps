import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule } from '@sneat/components';
import { MakeModelCardComponent } from '../make-model-card/make-model-card.component';
import { VehicleCardComponentModule } from '../vehicle-card/vehicle-card-component.module';

import { AssetAddVehicleComponent } from './asset-add-vehicle/asset-add-vehicle.component';

const exports = [AssetAddVehicleComponent];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorModule,
		SelectFromListModule,
		VehicleCardComponentModule,
		MakeModelCardComponent,
	],
	declarations: [...exports],
	exports,
})
export class AddAssetComponentsModule {
}
