import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EnvDbTablePage} from './env-db-table.page';

const routes: Routes = [
	{
		path: '',
		component: EnvDbTablePage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EnvDbTablePageRoutingModule {
}
