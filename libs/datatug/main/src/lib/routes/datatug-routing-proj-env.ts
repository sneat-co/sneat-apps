import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamDbCatalogId } from '../core/datatug-routing-params';

export const datatugProjEnvRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('../pages/signed-in/environment/environment-page.component').then(
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
			import('../pages/signed-in/servers/servers-page.component').then(
				(m) => m.ServersPageComponent,
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjEnvRoutes)],
	exports: [RouterModule],
})
export class DatatugProjEnvRoutingModule {}
