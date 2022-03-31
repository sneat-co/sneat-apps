import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {CommuneDocumentsPageComponent} from './commune-documents-page.component';
import {DocumentsByTypeComponent} from './components/documents-by-type/documents-by-type.component';
import {DocumentsListComponent} from './components/documents-list/documents-list.component';
import {SharedComponentsModule} from 'sneat-shared/components/shared-components.module';

const routes: Routes = [
	{
		path: '',
		component: CommuneDocumentsPageComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SharedComponentsModule,
	],
	declarations: [CommuneDocumentsPageComponent, DocumentsByTypeComponent, DocumentsListComponent],
})
export class CommuneDocumentsPageModule {
}
