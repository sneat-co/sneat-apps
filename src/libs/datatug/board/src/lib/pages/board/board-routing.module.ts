import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BoardPage} from './board.page';

const routes: Routes = [
	{
		path: '',
		component: BoardPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BoardPageRoutingModule {
}
