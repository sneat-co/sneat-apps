import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RetrospectivePage} from './retrospective.page';

const routes: Routes = [
	{
		path: '',
		component: RetrospectivePage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RetrospectivePageRoutingModule {
}
