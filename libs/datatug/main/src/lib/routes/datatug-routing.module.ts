import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SNEAT_AUTH_GUARDS } from '@sneat/auth-core';
import { routingParamStoreId } from '../core/datatug-routing-params';

export const datatugRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('../pages/home/datatug-home-page.component').then(
				(m) => m.DatatugHomePageComponent,
			),
	},
	{
		path: 'my',
		...SNEAT_AUTH_GUARDS,
		loadComponent: () =>
			import('../pages/my/page/datatug-my-page.component').then(
				(m) => m.DatatugMyPageComponent,
			),
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
})
export class DatatugRoutingModule {}
