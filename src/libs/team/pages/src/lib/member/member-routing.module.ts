import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberPageComponent } from './member.page';

const routes: Routes = [
	{
		path: '',
		component: MemberPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MemberPageRoutingModule {
}
