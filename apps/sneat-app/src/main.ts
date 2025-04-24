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
import { provideRouter } from '@angular/router';
import { sneatAppEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(SneatAppComponent, {
	providers: [
		...getStandardSneatProviders(sneatAppEnvironmentConfig),
		// App-specific providers
		provideAppInfo({ appId: 'sneat', appTitle: 'sneat.app' }),
		provideRouter([...routes, ...authRoutes]),
		provideRolesByType(undefined),
	],
}).catch((err) => console.error(err));

registerIonicons();
