import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactusRoutes } from '@sneat/extension-contactus-internal';
import { assetusRoutes } from '@sneat/extension-assetus-shared';
import { calendariusRoutes } from '@sneat/extension-calendarius-internal';
import { listusRoutes } from '@sneat/extension-listus-shared';
import { spacePagesRoutes } from '@sneat/extension-debtus-shared';
import { budgetusRoutes } from '@sneat/extension-budgetus';
import { docusRoutes } from '@sneat/extension-docus';
import { eventusRoutes } from '@sneat/extension-eventus-shared';
import { trackusSpaceRoutes } from '@sneat/extension-trackus';
import {
  SpaceComponentBaseParams,
  SpaceMenuComponent,
} from '@sneat/space-components';

const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full', -- for all routes
    component: SpaceMenuComponent,
    outlet: 'menu',
  },
  {
    path: '',
    data: { title: 'Space' },
    // pathMatch: 'full',
    loadComponent: () =>
      import('./space-page/space-page.component').then(
        (m) => m.SpacePageComponent,
      ),
  },
  ...contactusRoutes,
  ...spacePagesRoutes,
  ...budgetusRoutes,
  ...docusRoutes,
  ...listusRoutes,
  ...eventusRoutes,
  ...calendariusRoutes,
  ...trackusSpaceRoutes,
  { path: 'asset', pathMatch: 'full', redirectTo: 'assets' },
  ...assetusRoutes,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SpaceComponentBaseParams],
})
export class SpaceRoutingModule {}
