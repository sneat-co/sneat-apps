import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RetroTreePage } from './retro-tree.page';

const routes: Routes = [
	{
		path: '',
		component: RetroTreePage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RetroTreePageRoutingModule {}
