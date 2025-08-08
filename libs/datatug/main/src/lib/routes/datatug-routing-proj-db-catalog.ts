import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamTableType } from '../core/datatug-routing-params';

const datatugProjEnvDbCatalogRoutes: Routes = [
	{
		path: 'table/:' + routingParamTableType,
		loadComponent: () =>
			import('../pages/signed-in/env-db-table/env-db-table.page').then(
				(m) => m.EnvDbTablePageComponent,
			),
	},
	{
		path: 'view/:' + routingParamTableType,
		loadComponent: () =>
			import('../pages/signed-in/env-db-table/env-db-table.page').then(
				(m) => m.EnvDbTablePageComponent,
			),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjEnvDbCatalogRoutes)],
	exports: [RouterModule],
})
export class DatatugRoutingProjDbCatalog {}
