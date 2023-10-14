import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddAssetServicePageComponent } from './add-asset-service-page.component';

const routes: Routes = [
	{
		path: '',
		component: AddAssetServicePageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
	],
	declarations: [AddAssetServicePageComponent],
})
export class AddAssetServicePageModule {}
