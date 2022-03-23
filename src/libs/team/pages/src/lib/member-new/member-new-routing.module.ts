import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MemberNewPageComponent } from './member-new-page.component';

const routes: Routes = [
	{
		path: '',
		component: MemberNewPageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MemberNewPageRoutingModule {
}
