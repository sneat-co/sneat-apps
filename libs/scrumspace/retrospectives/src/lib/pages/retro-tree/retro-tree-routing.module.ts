import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RetroTreePageComponent } from './retro-tree-page.component';

const routes: Routes = [
	{
		path: '',
		component: RetroTreePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RetroTreePageRoutingModule {
}
