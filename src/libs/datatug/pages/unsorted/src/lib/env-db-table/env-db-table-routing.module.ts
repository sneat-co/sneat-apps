import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EnvDbTablePageComponent} from './env-db-table.page';

const routes: Routes = [
	{
		path: '',
		component: EnvDbTablePageComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EnvDbTablePageRoutingModule {
}
