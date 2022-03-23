import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
	routingParamBoard,
	routingParamDbCatalogId,
	routingParamDbModelId,
	routingParamDbServerId,
	routingParamDriver,
	routingParamEntityId,
	routingParamEnvironmentId,
	routingParamServerType,
} from '@sneat/datatug/core';

export const datatugProjectRoutes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.ProjectPageModule),
	},
	{
		path: 'board/:' + routingParamBoard,
		loadChildren: () =>
			import('@sneat/datatug/board/ui').then((m) => m.BoardPageModule),
	},
	{
		path: 'board',
		redirectTo: 'boards',
	},
	{
		path: 'boards',
		loadChildren: () =>
			import('@sneat/datatug/board/ui').then((m) => m.BoardsPageModule),
	},
	{
		path: 'entities',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.EntitiesPageModule),
	},
	{
		path: 'new-entity',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.EntityEditPageModule,
			),
	},
	{
		path: 'environments',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.EnvironmentsPageModule,
			),
	},
	{
		path: 'env',
		redirectTo: 'environments',
	},
	{
		path: 'widgets',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.WidgetsPageModule),
	},
	{
		path: 'tags',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.TagsPageModule),
	},
	{
		path: 'project',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.ProjectPageModule),
	},
	{
		path: 'dbmodel/:' + routingParamDbModelId,
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.DbModelPageModule),
	},
	{
		path: 'dbmodel',
		redirectTo: 'dbmodels',
	},
	{
		path: 'dbmodels',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.DbModelsPageModule),
	},
	{
		path: 'resources',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.ResourcesPageModule,
			),
	},
	{
		path: 'variables',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then(
				(m) => m.VariablesPageModule,
			),
	},
	{
		path: 'entity/:' + routingParamEntityId,
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.EntityPageModule),
	},
	{
		path: 'entity',
		redirectTo: 'entities',
	},
	{
		path: 'env/:' + routingParamEnvironmentId,
		loadChildren: () =>
			import('./datatug-routing-proj-env').then(
				(m) => m.DatatugProjEnvRoutingModule,
			),
	},
	{
		path: 'query',
		loadChildren: () =>
			import('@sneat/datatug/queries').then((m) => m.QueryPageModule),
	},
	{
		path: 'queries',
		loadChildren: () =>
			import('@sneat/datatug/queries').then((m) => m.QueriesPageModule),
	},
	{
		path: 'servers',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.ServersPageModule),
	},
	{
		// e.g. "db/sqlserver/localhost/AdventureWorks" for MS SQL Server
		path: `server/${routingParamServerType}/:${routingParamDriver}/:${routingParamDbServerId}/:${routingParamDbCatalogId}`,
		loadChildren: () =>
			import('./datatug-routing-proj-db-catalog').then(
				(m) => m.DatatugRoutingProjDbCatalog,
			),
	},
	{
		path: 'diff',
		loadChildren: () =>
			import('@sneat/datatug/pages/unsorted').then((m) => m.DiffPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjectRoutes)],
	exports: [RouterModule],
})
export class DatatugProjectRoutingModule {
}
