import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

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
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ModuleAssetRealEstate,
		RouterModule.forChild(routes),
	],
	declarations: [RealEstatePageComponent, AssetContactsGroupComponent],
})
export class RealEstatePageModule {}
