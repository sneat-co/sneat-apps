import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamStoreId } from '@sneat/datatug-core';
import { SNEAT_AUTH_GUARDS } from '@sneat/auth-core';

export const datatugRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@sneat/datatug-pages').then((m) => m.DatatugHomePageComponent),
	},
	{
		path: 'my',
		...SNEAT_AUTH_GUARDS,
		loadComponent: () =>
			import('@sneat/datatug-pages').then((m) => m.DatatugMyPageComponent),
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

@NgModule({
	imports: [RouterModule.forChild(datatugRoutes)],
	exports: [RouterModule],
})
export class DatatugRoutingModule {}
