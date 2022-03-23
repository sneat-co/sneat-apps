import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnvironmentsPageComponent } from './environments-page.component';

const routes: Routes = [
	{
		path: '',
		component: EnvironmentsPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EnvironmentsPageRoutingModule {
}
