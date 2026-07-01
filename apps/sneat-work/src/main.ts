// Main entry point for sneat.work

import { bootstrapApplication } from '@angular/platform-browser';
import { SneatApiBaseUrl } from '@sneat/api';
import {
  getStandardSneatProviders,
  provideAppInfo,
  provideRolesByType,
} from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { provideAssetusInternal } from '@sneat/extension-assetus-internal';
import { provideCalendariusInternal } from '@sneat/extension-calendarius-internal';
import { provideContactusInternal } from '@sneat/extension-contactus-internal';
import { provideDebtusInternal } from '@sneat/extension-debtus-internal';
import { EVENTUS_API_BASE_URL } from '@sneat/extension-eventus-contract';
import { provideEventusInternal } from '@sneat/extension-eventus-internal';
import { provideListusInternal } from '@sneat/extension-listus-internal';
import { provideRequoterInternal } from '@sneat/extension-requoter-internal';
import { provideTrackusInternal } from '@sneat/extension-trackus-internal';
import { routes } from './app/sneat-work-routing.module';
import { SneatWorkComponent } from './app/sneat-work.component';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { sneatWorkEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(SneatWorkComponent, {
  providers: [
    ...getStandardSneatProviders(sneatWorkEnvironmentConfig),
    provideAppInfo({ appId: 'sneat-work', appTitle: 'Sneat.work' }),
    // sneat-work mounts the shared space routes (@sneat/space-pages), so the
    // same contactus/assetus/calendarius DI tokens those pages inject must be
    // bound here too — otherwise space pages throw NG0201 (as sneat-app did
    // before the same wiring was added). See apps/sneat-app/src/main.ts.
    ...provideAssetusInternal(),
    ...provideContactusInternal(),
    ...provideCalendariusInternal(),
    // debtus pages (mounted via the shared space routes' spacePagesRoutes) inject
    // DEBTUS_SERVICE, so bind it here too — same latent gap fixed on sneat-app,
    // see apps/sneat-app/src/main.ts.
    ...provideDebtusInternal(),
    // Eventus pages (mounted via the shared space routes) inject service tokens
    // after the contract/internal/shared split, so bind them here too.
    ...provideEventusInternal(),
    // listus pages (mounted via the shared space routes' listusRoutes) inject
    // LISTUS_SERVICE, so bind it here too — same latent gap fixed on sneat-app,
    // see apps/sneat-app/src/main.ts.
    ...provideListusInternal(),
    // requoterOnboardingRoutes/requoterProfileRoutes are mounted via the same
    // shared space routes (@sneat/space-pages) that sneat-app uses, so
    // REQUOTER_SERVICE/REQUOTER_ONBOARD_SERVICE must be bound here too — this
    // was missed when requoter onboarding was wired into sneat-app only (#3435).
    // The profile view's heavier deps (Assetus AssetService) stay route-scoped
    // via requoterProfileRoutes, not bound here.
    ...provideRequoterInternal(),
    // trackus pages inject TRACKUS_*_SERVICE tokens; bind concrete services here.
    ...provideTrackusInternal(),
    // withComponentInputBinding + paramsInheritanceStrategy 'always': lets
    // routed pages receive route params (incl. inherited parent space params)
    // as component inputs — e.g. eventus pages inject `spaceID`/`spaceType`.
    provideRouter(
      [...routes, ...authRoutes],
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideRolesByType(undefined),
    // Eventus is mounted in the shared space routes, so it is reachable here
    // too. Point its API at the same sneat-go backend (SneatApiBaseUrl is
    // .../v0/; eventus uses /api4eventus, so strip the /v0/ suffix).
    {
      provide: EVENTUS_API_BASE_URL,
      useFactory: (apiBaseUrl: string) => apiBaseUrl.replace(/\/v0\/?$/, ''),
      deps: [SneatApiBaseUrl],
    },
  ],
}).catch((err) => console.error(err));

registerIonicons();
