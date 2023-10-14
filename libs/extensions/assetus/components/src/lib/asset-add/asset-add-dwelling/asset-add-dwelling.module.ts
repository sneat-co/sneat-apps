import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AssetAddDwellingPageComponent} from './asset-add-dwelling-page.component';
import {CountrySelectorComponent} from 'sneat-shared/components/country-selector/country-selector.module';

const routes: Routes = [
	{
		path: '',
		component: AssetAddDwellingPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		CountrySelectorComponent,
	],
	declarations: [AssetAddDwellingPageComponent]
})
export class AssetAddDwellingPageModule {
}
