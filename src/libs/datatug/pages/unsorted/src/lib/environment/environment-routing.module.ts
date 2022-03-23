import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EnvironmentPageComponent } from './environment-page.component';

const routes: Routes = [
	{
		path: '',
		component: EnvironmentPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class EnvironmentPageRoutingModule {
}
