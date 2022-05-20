import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvitePersonalPageComponent } from './invite-personal-page.component';

const routes: Routes = [
	{
		path: '',
		component: InvitePersonalPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class InvitePersonalPageRoutingModule {
}
