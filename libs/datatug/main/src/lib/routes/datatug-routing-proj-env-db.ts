import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamTableType } from '../core/datatug-routing-params';

export const datatugProjEnvDbRoutes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('../pages/signed-in/env-db/env-db-page.component').then(
				(m) => m.EnvDbPageComponent,
			),
	},
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
	imports: [RouterModule.forChild(datatugProjEnvDbRoutes)],
	exports: [RouterModule],
})
export class DatatugProjEnvDbRoutingModule {}
