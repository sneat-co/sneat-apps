import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AddMetricPage} from './add-metric.page';

const routes: Routes = [
	{
		path: '',
		component: AddMetricPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AddMetricPageRoutingModule {
}
