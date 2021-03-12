import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {QueryPageComponent} from './query-page.component';

const routes: Routes = [
	{
		path: '',
		component: QueryPageComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SqlEditorPageRoutingModule {
}
