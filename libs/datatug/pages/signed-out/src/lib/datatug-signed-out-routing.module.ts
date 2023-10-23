import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatatugSignedOutPageComponent } from './datatug-signed-out-page.component';

const routes: Routes = [
	{
		path: '',
		component: DatatugSignedOutPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DatatugSignedOutPageRoutingModule {}
