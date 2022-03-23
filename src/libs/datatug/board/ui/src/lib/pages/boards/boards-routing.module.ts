import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardsPageComponent } from './boards-page.component';

const routes: Routes = [
	{
		path: '',
		component: BoardsPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DataboardsPageRoutingModule {
}
