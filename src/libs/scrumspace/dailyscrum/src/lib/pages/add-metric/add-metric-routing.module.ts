import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddMetricPageComponent } from './add-metric-page.component';

const routes: Routes = [
	{
		path: '',
		component: AddMetricPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AddMetricPageRoutingModule {
}
