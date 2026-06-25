// Main entry point for the Sneat.app

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
import { EVENTUS_API_BASE_URL } from '@sneat/extension-eventus-contract';
import { provideEventusInternal } from '@sneat/extension-eventus-internal';
import { provideTrackusInternal } from '@sneat/extension-trackus-internal';
import { routes } from './app/sneat-app-routing.module';
import { SneatAppComponent } from './app/sneat-app.component';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { sneatAppEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';
//
bootstrapApplication(SneatAppComponent, {
  providers: [
    ...getStandardSneatProviders(sneatAppEnvironmentConfig),
    // App-specific providers
    provideAppInfo({ appId: 'sneat', appTitle: 'Sneat.app' }),
    // Binds the ASSET_SERVICE token to the concrete AssetService so pages that
    // extend AddAssetBaseComponent (e.g. docus new-document) resolve it.
    ...provideAssetusInternal(),
    // Binds the contactus DI tokens (CONTACT_SERVICE, CONTACTUS_SPACE_SERVICE,
    // CONTACT_NAV_SERVICE, etc.) to their concrete services so space pages that
    // inject them via token (e.g. family-space selection / side menu, and on a
    // hard page refresh) resolve instead of throwing NG0201.
    ...provideContactusInternal(),
    // Binds SCHEDULE_NAV_SERVICE to ScheduleNavService for space pages that
    // surface schedule/happenings (handover §4.4).
    ...provideCalendariusInternal(),
    // Binds the eventus service tokens (EVENT_SERVICE, RSVP_SERVICE, etc.) to
    // their concrete services. Eventus pages (mounted via the shared space
    // routes) now inject by token after the contract/internal/shared split, so
    // without this they throw NG0201.
    ...provideEventusInternal(),
    // trackus pages (mounted via the shared space routes) inject the
    // TRACKUS_*_SERVICE tokens after the contract/internal/shared split, so bind
    // the concrete services at the composition root.
    ...provideTrackusInternal(),
    // withComponentInputBinding: lets routed pages receive route params as
    // component inputs (e.g. eventus pages inject `spaceID`/`spaceType` directly
    // — simpler than SpaceComponentBaseParams when only the id is needed).
    // paramsInheritanceStrategy 'always': child routes (e.g. events/:eventID)
    // inherit the parent space route's :spaceType/:spaceID params too.
    provideRouter(
      [...routes, ...authRoutes],
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideRolesByType(undefined),
    // Eventus calls /api4eventus on the same sneat-go backend as the rest of
    // the app. SneatApiBaseUrl is e.g. https://api.sneat.ws/v0/, but eventus
    // paths are /api4eventus/... (not under /v0/), so strip the /v0/ suffix.
    // Without this the default ('') makes calls same-origin → they hit the SPA.
    {
      provide: EVENTUS_API_BASE_URL,
      useFactory: (apiBaseUrl: string) => apiBaseUrl.replace(/\/v0\/?$/, ''),
      deps: [SneatApiBaseUrl],
    },
  ],
}).catch((err) => console.error(err));

registerIonicons();
