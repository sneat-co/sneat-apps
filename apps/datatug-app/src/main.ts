// Main entry point for the Sneat.app

import { bootstrapApplication } from '@angular/platform-browser';
import {
  getStandardSneatProviders,
  provideAppInfo,
  provideRolesByType,
} from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { EnvConfigToken } from '@sneat/core';
import { routes } from './app/datatug-app-routes';
import { DatatugAppComponent } from './app/datatug-app.component';
import { provideRouter } from '@angular/router';
import { datatugAppEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(DatatugAppComponent, {
  providers: [
    ...getStandardSneatProviders(datatugAppEnvironmentConfig),
    // App-specific providers
    provideAppInfo({
      appId: 'datatug',
      appTitle: 'DataTug.app',
    }),
    {
      // TODO: Verify if this is needed and document how if it is
      provide: EnvConfigToken,
      useValue: datatugAppEnvironmentConfig,
    },
    provideRouter([...routes, ...authRoutes]),
    provideRolesByType(undefined),
  ],
}).catch((err) => console.error(err));

registerIonicons();
