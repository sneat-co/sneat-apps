import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {DocumentNewPageComponent} from './document-new-page.component';
import {CountrySelectorModule} from 'sneat-shared/components/country-selector/country-selector.module';

const routes: Routes = [
	{
		path: '',
		component: DocumentNewPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		CountrySelectorModule,
	],
	declarations: [DocumentNewPageComponent]
})
export class DocumentNewPageModule {
}
