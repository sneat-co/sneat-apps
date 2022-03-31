import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {RealEstatesPageComponent} from './real-estates-page.component';
import {ModuleAssetsList} from '../../module.assets-list';

const routes: Routes = [
	{
		path: '',
		component: RealEstatesPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ModuleAssetsList,
		RouterModule.forChild(routes)
	],
	declarations: [RealEstatesPageComponent],
})
export class RealEstatesPageModule {
}
