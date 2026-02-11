import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { routingParamProjectId } from '../core/datatug-routing-params';

export const datatugStoreRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/signed-in/store/datatug-store-page.component').then(
        (m) => m.DatatugStorePageComponent,
      ),
  },
  {
    path: 'diff',
    loadComponent: () =>
      import('../pages/signed-in/diff/diff-page.component').then(
        (m) => m.DiffPageComponent,
      ),
  },
  {
    path: 'project/:' + routingParamProjectId,
    loadChildren: () =>
      import('./datatug-routing-proj').then(
        (m) => m.DatatugProjectRoutingModule,
      ),
  },
  {
    path: 'project',
    redirectTo: '',
  },
  {
    path: 'environment',
    loadComponent: () =>
      import('../pages/signed-in/environment/environment-page.component').then(
        (m) => m.EnvironmentPageComponent,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(datatugStoreRoutes)],
  exports: [RouterModule],
})
export class DatatugStoreRoutingModule {}
