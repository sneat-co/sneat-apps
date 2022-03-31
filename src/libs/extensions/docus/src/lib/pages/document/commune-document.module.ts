import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {CommuneDocumentPageComponent} from './commune-document-page.component';

const routes: Routes = [
	{
		path: '',
		component: CommuneDocumentPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes)
	],
	declarations: [CommuneDocumentPageComponent]
})
export class CommuneDocumentPageModule {
}
