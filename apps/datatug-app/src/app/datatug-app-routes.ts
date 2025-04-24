import { Routes } from '@angular/router';
import { datatugRoutes } from '@sneat/ext-datatug-routes';

export const routes: Routes = [
	{
		path: 'hello-world',
		loadChildren: () =>
			import('./hello-world-page.component').then(
				(m) => m.HelloWorldPageComponent,
			),
	},
	{
		path: 'home',
		loadChildren: () =>
			import('@sneat/ext-datatug-pages').then(
				(m) => m.DatatugHomePageComponent,
			),
	},
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	...datatugRoutes,
];
