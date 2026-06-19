import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactusRoutes } from '@sneat/contactus-internal';
import { spacePagesRoutes } from '@sneat/ext-debtus-internal';
import { assetusRoutes } from '@sneat/extension-assetus';
import { budgetusRoutes } from '@sneat/extensions-budgetus';
import { docusRoutes } from '@sneat/extensions-docus';
import { eventusRoutes } from '@sneat/extension-eventus';
import { listusRoutes } from '@sneat/extension-listus';
import { calendariusRoutes } from '@sneat/extensions-calendarius-main';
import { trackusSpaceRoutes } from '@sneat/extensions-trackus';
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
