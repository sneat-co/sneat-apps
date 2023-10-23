import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DbModelPageComponent } from './db-model-page.component';

const routes: Routes = [
	{
		path: '',
		component: DbModelPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DbModelPageRoutingModule {}
