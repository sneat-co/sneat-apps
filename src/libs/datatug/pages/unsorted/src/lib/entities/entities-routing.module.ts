import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EntitiesPage} from './entities.page';

const routes: Routes = [
	{
		path: '',
		component: EntitiesPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EntitiesPageRoutingModule {
}
