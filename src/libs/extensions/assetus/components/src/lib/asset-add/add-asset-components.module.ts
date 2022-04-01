import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule } from '@sneat/components';
import { TeamComponentContextModule } from '@sneat/team/components';

import { AssetAddVehicleComponent } from './asset-add-vehicle/asset-add-vehicle.component';

const exports = [AssetAddVehicleComponent];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorModule,
		TeamComponentContextModule,
	],
	declarations: [...exports],
	exports,
})
export class AddAssetComponentsModule {
}
