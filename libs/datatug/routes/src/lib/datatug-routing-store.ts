import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamProjectId } from '@sneat/ext-datatug-core';

export const datatugStoreRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then(
				(m) => m.DatatugStorePageComponent,
			),
	},
	{
		path: 'diff',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.DiffPageComponent),
	},
	{
		path: 'project/:' + routingParamProjectId,
		loadChildren: () =>
			import('./datatug-routing-proj').then(
				(m) => m.DatatugProjectRoutingModule,
			),
	},
	{
		path: 'project',
		redirectTo: '',
	},
	{
		path: 'environment',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then(
				(m) => m.EnvironmentPageComponent,
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugStoreRoutes)],
	exports: [RouterModule],
})
export class DatatugStoreRoutingModule {}
