// Main entry point for the Sneat.app

import { bootstrapApplication } from '@angular/platform-browser';
import {
  getStandardSneatProviders,
  provideAppInfo,
  provideRolesByType,
} from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { routes } from './app/sneat-app-routing.module';
import { SneatAppComponent } from './app/sneat-app.component';
import { ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { sneatAppEnvironmentConfig } from './environments/environment';
import { ChunkLoadErrorHandler } from './app/chunk-load-error.handler';
import { registerIonicons } from './register-ionicons';
//
bootstrapApplication(SneatAppComponent, {
  providers: [
    ...getStandardSneatProviders(sneatAppEnvironmentConfig),
    // App-specific providers
    provideAppInfo({ appId: 'sneat', appTitle: 'Sneat.app' }),
    provideRouter([...routes, ...authRoutes]),
    provideRolesByType(undefined),
    // Recover from stale lazy-chunk loads after a deploy (see handler doc).
    { provide: ErrorHandler, useClass: ChunkLoadErrorHandler },
  ],
}).catch((err) => console.error(err));

registerIonicons();
