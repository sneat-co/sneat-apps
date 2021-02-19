import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EntityPage} from './entity.page';

const routes: Routes = [
	{
		path: '',
		component: EntityPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EntityPageRoutingModule {
}
