import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DbModelPage} from './db-model-page.component';

const routes: Routes = [
	{
		path: '',
		component: DbModelPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DbModelPageRoutingModule {
}
