import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScrumPageComponent } from './scrum-page.component';

const routes: Routes = [
	{
		path: '',
		component: ScrumPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ScrumPageRoutingModule {}
