import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RetrospectivePageComponent } from './retrospective-page.component';

const routes: Routes = [
	{
		path: '',
		component: RetrospectivePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RetrospectivePageRoutingModule {}
