import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserProfilePage } from './user-profile.page';

const routes: Routes = [
	{
		path: '',
		component: UserProfilePage,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserProfilePageRoutingModule {}
