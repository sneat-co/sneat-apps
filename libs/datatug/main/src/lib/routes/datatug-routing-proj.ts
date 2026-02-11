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
} from '../core/datatug-routing-params';

export const datatugProjectRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/signed-in/project/project-page.component').then(
        (m) => m.ProjectPageComponent,
      ),
  },
  {
    path: 'board/:' + routingParamBoard,
    loadComponent: () =>
      import('../board/ui/pages/board/board-page.component').then(
        (m) => m.BoardPageComponent,
      ),
  },
  {
    path: 'board',
    redirectTo: 'boards',
  },
  {
    path: 'boards',
    loadComponent: () =>
      import('../board/ui/pages/boards/boards-page.component').then(
        (m) => m.BoardsPageComponent,
      ),
  },
  {
    path: 'entities',
    loadComponent: () =>
      import('../pages/signed-in/entities/entities-page.component').then(
        (m) => m.EntitiesPageComponent,
      ),
  },
  {
    path: 'new-entity',
    loadComponent: () =>
      import('../pages/signed-in/entity-edit/entity-edit-page.component').then(
        (m) => m.EntityEditPageComponent,
      ),
  },
  {
    path: 'environments',
    loadComponent: () =>
      import('../pages/signed-in/environments/environments-page.component').then(
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
      import('../pages/signed-in/widgets/widgets-page.component').then(
        (m) => m.WidgetsPageComponent,
      ),
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('../pages/signed-in/tags/tags-page.component').then(
        (m) => m.TagsPageComponent,
      ),
  },
  {
    path: 'project',
    loadComponent: () =>
      import('../pages/signed-in/project/project-page.component').then(
        (m) => m.ProjectPageComponent,
      ),
  },
  {
    path: 'dbmodel/:' + routingParamDbModelId,
    loadComponent: () =>
      import('../pages/signed-in/db-schema/db-model-page.component').then(
        (m) => m.DbModelPageComponent,
      ),
  },
  {
    path: 'dbmodel',
    redirectTo: 'dbmodels',
  },
  {
    path: 'dbmodels',
    loadComponent: () =>
      import('../pages/signed-in/db-schemas/db-models-page.component').then(
        (m) => m.DbModelsPageComponent,
      ),
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('../pages/signed-in/resources/resources-page.component').then(
        (m) => m.ResourcesPageComponent,
      ),
  },
  {
    path: 'variables',
    loadComponent: () =>
      import('../pages/signed-in/variables/variables-page.component').then(
        (m) => m.VariablesPageComponent,
      ),
  },
  {
    path: 'entity/:' + routingParamEntityId,
    loadComponent: () =>
      import('../pages/signed-in/entity/entity-page.component').then(
        (m) => m.EntityPageComponent,
      ),
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
    loadComponent: () =>
      import('../queries/query/page/query-page.component').then(
        (m) => m.QueryPageComponent,
      ),
  },
  {
    path: 'queries',
    loadComponent: () =>
      import('../queries/queries/queries-page.component').then(
        (m) => m.QueriesPageComponent,
      ),
  },
  {
    path: 'servers',
    loadComponent: () =>
      import('../pages/signed-in/servers/servers-page.component').then(
        (m) => m.ServersPageComponent,
      ),
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
      import('../pages/signed-in/diff/diff-page.component').then(
        (m) => m.DiffPageComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(datatugProjectRoutes)],
  exports: [RouterModule],
})
export class DatatugProjectRoutingModule {}
