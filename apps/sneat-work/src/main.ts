// Main entry point for sneat.work

import { bootstrapApplication } from '@angular/platform-browser';
import { SneatApiBaseUrl } from '@sneat/api';
import {
  getStandardSneatProviders,
  provideAppInfo,
  provideRolesByType,
} from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { SneatApp } from '@sneat/core';
import { EVENTUS_API_BASE_URL } from '@sneat/extension-eventus';
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
    // NOTE: 'sneat-work' is not yet in the SneatApp union type in @sneat/core@0.4.0;
    // cast applied here as a temporary deviation from the plan. Follow-up: extend
    // SneatApp in sneat-libs/libs/core/src/lib/app.service.ts and republish.
    provideAppInfo({ appId: 'sneat-work' as SneatApp, appTitle: 'Sneat.work' }),
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
