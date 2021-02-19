import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DbserverPage} from './dbserver.page';

const routes: Routes = [
	{
		path: '',
		component: DbserverPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DbserverPageRoutingModule {
}
