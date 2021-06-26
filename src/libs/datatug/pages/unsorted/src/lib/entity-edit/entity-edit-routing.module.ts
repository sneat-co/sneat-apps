import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {EntityEditPageComponent} from './entity-edit-page.component';

const routes: Routes = [
	{
		path: '',
		component: EntityEditPageComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EntityEditPageRoutingModule {
}
