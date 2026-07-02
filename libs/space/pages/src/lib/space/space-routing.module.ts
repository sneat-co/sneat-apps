import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactusRoutes } from '@sneat/extension-contactus-internal';
import { assetusRoutes } from '@sneat/extension-assetus-shared';
import { calendariusRoutes } from '@sneat/extension-calendarius-internal';
import { listusRoutes } from '@sneat/extension-listus-shared';
import { spacePagesRoutes } from '@sneat/extension-debtus-shared';
import { budgetusRoutes } from '@sneat/extension-budgetus-shared';
import { docusRoutes } from '@sneat/extension-docus-shared';
import { eventusRoutes } from '@sneat/extension-eventus-shared';
import { trackusSpaceRoutes } from '@sneat/extension-trackus-shared';
import {
  requoterOnboardingRoutes,
  requoterProfileRoutes,
} from '@sneat/extension-requoter-internal';
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
  // Discover (AI vague-description movie search) for the listus To-Watch list.
  // Lives here (not in @sneat/extension-listus-shared) because the published
  // listus packages predate the movies/identify endpoint; must be registered
  // BEFORE listusRoutes so it wins over their `list/:listType/:listID` route.
  {
    path: 'list/:listType/:listID/discover',
    data: { title: 'Discover movies' },
    loadComponent: () =>
      import('./discover-movies/discover-movies-page.component').then(
        (m) => m.DiscoverMoviesPageComponent,
      ),
  },
  ...listusRoutes,
  ...eventusRoutes,
  ...calendariusRoutes,
  ...trackusSpaceRoutes,
  // requoter single-form onboarding + its profile-details exit (the latter carries
  // route-scoped providers for the Assetus-backed profile read view).
  ...requoterOnboardingRoutes,
  ...requoterProfileRoutes,
  { path: 'asset', pathMatch: 'full', redirectTo: 'assets' },
  ...assetusRoutes,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SpaceComponentBaseParams],
})
export class SpaceRoutingModule {}
