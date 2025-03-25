import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamDbCatalogId } from '@sneat/ext-datatug-core';

export const datatugProjEnvRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then(
				(m) => m.EnvironmentPageComponent,
			),
	},
	{
		path: 'db/:' + routingParamDbCatalogId,
		loadChildren: () =>
			import('./datatug-routing-proj-env-db').then(
				(m) => m.DatatugProjEnvDbRoutingModule,
			),
	},
	{
		path: 'servers',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.ServersPageComponent),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjEnvRoutes)],
	exports: [RouterModule],
})
export class DatatugProjEnvRoutingModule {}
