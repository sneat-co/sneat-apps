import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamTableType } from '@sneat/ext-datatug-core';

export const datatugProjEnvDbRoutes: Routes = [
	{
		path: 'table/:' + routingParamTableType,
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.EnvDbTablePageComponent),
	},
	{
		path: 'view/:' + routingParamTableType,
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.EnvDbTablePageComponent),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjEnvDbRoutes)],
	exports: [RouterModule],
})
export class DatatugRoutingProjDbCatalog {}
