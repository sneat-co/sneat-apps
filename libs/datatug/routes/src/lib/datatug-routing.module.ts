import { Routes } from '@angular/router';
import { routingParamStoreId } from '@sneat/ext-datatug-core';
import { SNEAT_AUTH_GUARDS } from '@sneat/auth-core';

export const datatugRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then(
				(m) => m.DatatugHomePageComponent,
			),
	},
	{
		path: 'my',
		...SNEAT_AUTH_GUARDS,
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.DatatugMyPageComponent),
	},
	{
		path: 'store/:' + routingParamStoreId,
		loadChildren: () =>
			import('./datatug-routing-store').then(
				(m) => m.DatatugStoreRoutingModule,
			),
		// ...canLoad(),
	},
	{
		path: 'agent',
		redirectTo: '/',
	},
];
