import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SqlQueryPageComponent} from './sql-query-page.component';

const routes: Routes = [
	{
		path: '',
		component: SqlQueryPageComponent
	},
	{
		path: ':queryId',
		component: SqlQueryPageComponent,
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class QueryPageRoutingModule {
}
