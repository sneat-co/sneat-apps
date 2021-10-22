import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesPage } from './resources.page';

const routes: Routes = [
	{
		path: '',
		component: ResourcesPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ResourcesPageRoutingModule {}
