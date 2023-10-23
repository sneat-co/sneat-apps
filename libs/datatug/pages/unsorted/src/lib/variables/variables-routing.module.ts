import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VariablesPageComponent } from './variables-page.component';

const routes: Routes = [
	{
		path: '',
		component: VariablesPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class VariablesPageRoutingModule {}
