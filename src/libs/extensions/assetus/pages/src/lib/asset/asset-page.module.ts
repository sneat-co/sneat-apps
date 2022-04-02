import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ModuleAssetRealEstate } from '@sneat/extensions/assetus/components';

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
		// SharedComponentsModule,
		RouterModule.forChild(routes),
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
