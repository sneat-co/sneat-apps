import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WidgetsPageComponent } from './widgets-page.component';

const routes: Routes = [
	{
		path: '',
		component: WidgetsPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class WidgetsPageRoutingModule {
}
