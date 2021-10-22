import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatatugSignedOutPage } from './datatug-signed-out-page.component';

const routes: Routes = [
	{
		path: '',
		component: DatatugSignedOutPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DatatugSignedOutPageRoutingModule {}
