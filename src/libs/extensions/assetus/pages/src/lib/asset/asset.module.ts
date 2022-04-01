import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetPageComponent} from './asset-page.component';
import {MakeModelEngineComponent} from '../../components/make-model-engine/make-model-engine.component';
import {AssetDatesComponent} from '../../components/asset-dates/asset-dates.component';
import {AssetLiabilitiesComponent} from '../../components/asset-liabilities/asset-liabilities.component';
import {ModuleAssetRealEstate} from '../../module.asset.real-estate';
import {SharedComponentsModule} from 'sneat-shared/components/shared-components.module';

const routes: Routes = [
	{
		path: '',
		component: AssetPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ModuleAssetRealEstate,
		SharedComponentsModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		AssetPageComponent,
		MakeModelEngineComponent,
		AssetDatesComponent,
		AssetLiabilitiesComponent,
	],
})
export class AssetPageModule {
}
