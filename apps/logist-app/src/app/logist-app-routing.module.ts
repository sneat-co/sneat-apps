import { Routes } from '@angular/router';
// TODO: fix & remove this eslint hint @nrwl/nx/enforce-module-boundaries

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () =>
			import('../pages/logist-app-home-page.component').then(
				(m) => m.LogistAppHomePageComponent,
			),
	},
	{
		path: 'signed-out',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: '',
		outlet: 'menu',
		pathMatch: 'full',
		loadChildren: () =>
			import('@sneat/extensions-logist').then((m) => m.LogistMenuLazyComponent),
	},
	{
		path: 'space/:spaceType/:spaceID',
		loadChildren: () =>
			import('@sneat/extensions-logist').then(
				(m) => m.LogistSpaceRoutingModule,
			),
	},
];
