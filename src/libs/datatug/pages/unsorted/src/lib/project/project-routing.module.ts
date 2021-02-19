import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProjectPage} from './project.page';

const routes: Routes = [
	{
		path: '',
		component: ProjectPage
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ProjectPageRoutingModule {
}
