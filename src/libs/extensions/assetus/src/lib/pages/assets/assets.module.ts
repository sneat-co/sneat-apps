import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetsPageComponent} from './assets-page.component';
import {ModuleAssetsList} from '../../module.assets-list';
import {SharedComponentsModule} from '../../../../components/shared-components.module';

const routes: Routes = [
	{
		path: '',
		component: AssetsPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ModuleAssetsList,
		SharedComponentsModule,
		RouterModule.forChild(routes)
	],
	declarations: [AssetsPageComponent]
})
export class AssetsPageModule {
}
