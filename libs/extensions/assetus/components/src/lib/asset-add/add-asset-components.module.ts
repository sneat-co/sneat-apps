import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {
	CountrySelectorComponent,
	SelectFromListModule,
} from '@sneat/components';
import { MakeModelCardComponent } from '../make-model-card/make-model-card.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';
import { AssetAddDocumentComponent } from './asset-add-document/asset-add-document.component';
import { AssetAddVehicleComponent } from './asset-add-vehicle/asset-add-vehicle.component';
import { AssetAddDwellingComponent } from './asset-add-dwelling/asset-add-dwelling.component';
import { AddDwellingCardComponent } from '../edit-dwelling-card/edit-dwelling-card.component';

@NgModule({
	declarations: [AssetAddVehicleComponent, AssetAddDwellingComponent],
	exports: [AssetAddVehicleComponent, AssetAddDwellingComponent],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CountrySelectorComponent,
		SelectFromListModule,
		VehicleCardComponent,
		MakeModelCardComponent,
		VehicleCardComponent,
		AddDwellingCardComponent,
	],
})
export class AddAssetComponentsModule {}
