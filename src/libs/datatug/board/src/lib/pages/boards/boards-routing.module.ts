import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BoardsPage} from './boards-page.component';

const routes: Routes = [
	{
		path: '',
		component: BoardsPage
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DataboardsPageRoutingModule {
}
