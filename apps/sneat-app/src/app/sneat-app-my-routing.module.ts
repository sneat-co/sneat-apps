import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'profile',
			},
			{
				path: 'profile',
				loadChildren: () =>
					import('@sneat/user').then((m) => m.UserMyProfilePageRoutingModule),
			},
			{
				path: 'spaces',
				loadChildren: () =>
					import('@sneat/team/pages').then((m) => m.TeamsPageModule),
			},
		]),
	],
})
export class SneatAppMyRoutingModule {}
