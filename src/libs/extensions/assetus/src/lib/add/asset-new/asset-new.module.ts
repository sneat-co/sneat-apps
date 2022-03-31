import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetNewPageComponent} from './asset-new-page.component';

const routes: Routes = [
	{
		path: '',
		component: AssetNewPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [AssetNewPageComponent]
})
export class AssetNewPageModule {
}
