import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScrumPage } from './scrum.page';

const routes: Routes = [
	{
		path: '',
		component: ScrumPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ScrumPageRoutingModule {}
