import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatatugMyPageComponent } from './page/datatug-my-page.component';

const routes: Routes = [
	{
		path: '',
		component: DatatugMyPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MyPageRoutingModule {}
