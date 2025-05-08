import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { RealEstatePageComponent } from './real-estate-page.component';
import { ModuleAssetRealEstate } from '../../module.asset.real-estate';
import { AssetContactsGroupComponent } from '../../components/asset-contacts-group/asset-contacts-group.component';

const routes: Routes = [
	{
		path: '',
		component: RealEstatePageComponent,
	},
];

@NgModule({
	imports: [FormsModule, ModuleAssetRealEstate, RouterModule.forChild(routes)],
	declarations: [RealEstatePageComponent, AssetContactsGroupComponent],
})
export class RealEstatePageModule {}
