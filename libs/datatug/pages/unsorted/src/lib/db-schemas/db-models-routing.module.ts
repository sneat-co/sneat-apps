import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbModelsPageComponent } from './db-models-page.component';

const routes: Routes = [
	{
		path: '',
		component: DbModelsPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DbModelsPageRoutingModule {}
