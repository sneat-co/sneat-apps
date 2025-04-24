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
} from '@sneat/ext-datatug-core';

export const datatugProjectRoutes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.ProjectPageComponent),
	},
	{
		path: 'board/:' + routingParamBoard,
		loadComponent: () =>
			import('@sneat/ext-datatug-board-ui').then((m) => m.BoardPageComponent),
	},
	{
		path: 'board',
		redirectTo: 'boards',
	},
	{
		path: 'boards',
		loadComponent: () =>
			import('@sneat/ext-datatug-board-ui').then((m) => m.BoardsPageComponent),
	},
	{
		path: 'entities',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.EntitiesPageComponent),
	},
	{
		path: 'new-entity',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.EntityEditPageComponent),
	},
	{
		path: 'environments',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then(
				(m) => m.EnvironmentsPageComponent,
			),
	},
	{
		path: 'env',
		redirectTo: 'environments',
	},
	{
		path: 'widgets',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.WidgetsPageComponent),
	},
	{
		path: 'tags',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.TagsPageComponent),
	},
	{
		path: 'project',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.ProjectPageComponent),
	},
	{
		path: 'dbmodel/:' + routingParamDbModelId,
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.DbModelPageComponent),
	},
	{
		path: 'dbmodel',
		redirectTo: 'dbmodels',
	},
	{
		path: 'dbmodels',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.DbModelsPageComponent),
	},
	{
		path: 'resources',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.ResourcesPageComponent),
	},
	{
		path: 'variables',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.VariablesPageComponent),
	},
	{
		path: 'entity/:' + routingParamEntityId,
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.EntityPageComponent),
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
		path: 'query/:queryId',
		loadChildren: () =>
			import('@sneat/ext-datatug-queries').then((m) => m.QueryPageComponent),
	},
	{
		path: 'queries',
		loadComponent: () =>
			import('@sneat/ext-datatug-queries').then((m) => m.QueriesPageComponent),
	},
	{
		path: 'servers',
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.ServersPageComponent),
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
		loadComponent: () =>
			import('@sneat/ext-datatug-pages').then((m) => m.DiffPageComponent),
	},
];

@NgModule({
	imports: [RouterModule.forChild(datatugProjectRoutes)],
	exports: [RouterModule],
})
export class DatatugProjectRoutingModule {}
