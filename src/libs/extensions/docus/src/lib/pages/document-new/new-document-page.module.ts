import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule, SneatPipesModule } from '@sneat/components';
import { MembersSelectorModule } from '@sneat/team/components';
import { DocumentServiceModule } from '../../services/document-service.module';

import { NewDocumentPageComponent } from './new-document-page.component';

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
		SelectFromListModule,
		MembersSelectorModule,
	],
	declarations: [NewDocumentPageComponent]
})
export class NewDocumentPageModule {
}
