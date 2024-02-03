import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamTableType } from '@sneat/datatug-core';

export const datatugProjEnvDbRoutes: Routes = [
	{
		path: 'table/:' + routingParamTableType,
		loadComponent: () =>
			import('@sneat/datatug-pages').then((m) => m.EnvDbTablePageComponent),
	},
	{
		path: 'view/:' + routingParamTableType,
		loadComponent: () =>
			import('@sneat/datatug-pages').then((m) => m.EnvDbTablePageComponent),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjEnvDbRoutes)],
	exports: [RouterModule],
})
export class DatatugRoutingProjDbCatalog {}
