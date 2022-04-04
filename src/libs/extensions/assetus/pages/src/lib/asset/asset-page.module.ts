import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ModuleAssetRealEstate, VehicleCardComponentModule } from '@sneat/extensions/assetus/components';

import { AssetPageComponent } from './asset-page.component';

const routes: Routes = [
	{
		path: '',
		component: AssetPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ModuleAssetRealEstate,
		VehicleCardComponentModule,
		// SharedComponentsModule,
		RouterModule.forChild(routes),
		IonicModule,
	],
	declarations: [
		AssetPageComponent,
		// MakeModelEngineComponent,
		// AssetDatesComponent,
		// AssetLiabilitiesComponent,
	],
})
export class AssetPageModule {
}
