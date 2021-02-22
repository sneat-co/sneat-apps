import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {QueriesPage} from './queries.page';

const routes: Routes = [
	{
		path: '',
		component: QueriesPage
	},
	{
		path: ':queryId',
		loadChildren: () => import('../sql-query/query.module').then(m => m.QueryPageModule),
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SqlQueriesPageRoutingModule {
}
