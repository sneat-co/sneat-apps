import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamTableType } from '@sneat/datatug/core';

export const datatugProjEnvDbRoutes: Routes = [
	{
		path: 'table/:' + routingParamTableType,
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.EnvDbTablePageModule
			),
	},
	{
		path: 'view/:' + routingParamTableType,
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.EnvDbTablePageModule
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjEnvDbRoutes)],
	exports: [RouterModule],
})
export class DatatugRoutingProjDbCatalog {}
