import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DbModelsPage} from './db-models-page.component';

const routes: Routes = [
	{
		path: '',
		component: DbModelsPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DbModelsPageRoutingModule {
}
