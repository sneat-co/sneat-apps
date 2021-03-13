import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {QueriesPageComponent} from './queries-page.component';

const routes: Routes = [
	{
		path: '',
		component: QueriesPageComponent
	},
	{
		path: ':queryId',
		loadChildren: () => import('../query/sql-query/sql-query-page.module').then(m => m.SqlQueryPageModule),
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SqlQueriesPageRoutingModule {
}
