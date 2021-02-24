import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MemberPage} from './member.page';

const routes: Routes = [
	{
		path: '',
		component: MemberPage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MemberPageRoutingModule {
}
