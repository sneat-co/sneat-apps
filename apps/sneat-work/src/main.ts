// Main entry point for sneat.work

import { bootstrapApplication } from '@angular/platform-browser';
import {
  getStandardSneatProviders,
  provideAppInfo,
  provideRolesByType,
} from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { SneatApp } from '@sneat/core';
import { routes } from './app/sneat-work-routing.module';
import { SneatWorkComponent } from './app/sneat-work.component';
import { provideRouter } from '@angular/router';
import { sneatWorkEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(SneatWorkComponent, {
  providers: [
    ...getStandardSneatProviders(sneatWorkEnvironmentConfig),
    // NOTE: 'sneat-work' is not yet in the SneatApp union type in @sneat/core@0.4.0;
    // cast applied here as a temporary deviation from the plan. Follow-up: extend
    // SneatApp in sneat-libs/libs/core/src/lib/app.service.ts and republish.
    provideAppInfo({ appId: 'sneat-work' as SneatApp, appTitle: 'sneat.work' }),
    provideRouter([...routes, ...authRoutes]),
    provideRolesByType(undefined),
  ],
}).catch((err) => console.error(err));

registerIonicons();
