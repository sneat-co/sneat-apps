import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvitePersonalPage } from './invite-personal.page';

const routes: Routes = [
	{
		path: '',
		component: InvitePersonalPage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class InvitePersonalPageRoutingModule {}
