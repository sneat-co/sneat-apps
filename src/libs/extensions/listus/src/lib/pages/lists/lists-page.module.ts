import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ListusCoreServicesModule } from '../../services/listus-core-services.module';

import { ListsPageComponent } from './lists-page.component';
import { NewListDialogModule } from './new-list-dialog.module';

const routes: Routes = [
	{
		path: '',
		component: ListsPageComponent,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		ListusCoreServicesModule,
		NewListDialogModule,
	],
	declarations: [ListsPageComponent],
})
export class ListsPageModule {
}
