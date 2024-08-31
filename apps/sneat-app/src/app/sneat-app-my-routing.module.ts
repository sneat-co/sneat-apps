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
				loadComponent: () =>
					import('@sneat/user').then((m) => m.UserMyProfilePageComponent),
			},
			{
				path: 'spaces',
				loadChildren: () =>
					import('@sneat/team-pages').then((m) => m.SpacesPageModule),
			},
		]),
	],
})
export class SneatAppMyRoutingModule {}
