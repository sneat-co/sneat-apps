import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserProfilePageComponent } from './user-profile-page.component';

const routes: Routes = [
	{
		path: '',
		component: UserProfilePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UserProfilePageRoutingModule {
}
