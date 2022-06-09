import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FilterItemModule } from '@sneat/components';
import { DocumentServiceModule } from '../../services/document-service.module';
import { TeamCoreComponentsModule } from '@sneat/team/components';
import { DocumentsByTypeComponent } from './components/documents-by-type/documents-by-type.component';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';

import { DocumentsPageComponent } from './documents-page.component';

const routes: Routes = [
	{
		path: '',
		component: DocumentsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		TeamCoreComponentsModule,
		FilterItemModule,
		DocumentServiceModule,
	],
	declarations: [
		DocumentsListComponent,
		DocumentsByTypeComponent,
		DocumentsPageComponent,
	],
})
export class DocumentsPageModule {
}
