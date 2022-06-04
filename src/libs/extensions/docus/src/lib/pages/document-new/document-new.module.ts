import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import { CountrySelectorModule, SneatPipesModule } from '@sneat/components';
import { DocumentServiceModule } from '@sneat/extensions/docus';

import {NewDocumentPageComponent} from './new-document-page.component';

const routes: Routes = [
	{
		path: '',
		component: NewDocumentPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		CountrySelectorModule,
		DocumentServiceModule,
		SneatPipesModule,
	],
	declarations: [NewDocumentPageComponent]
})
export class DocumentNewPageModule {
}
