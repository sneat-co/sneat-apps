import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { getStandardSneatProviders } from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { TopMenuService } from '@sneat/core';
import { sneatAppEnvironmentConfig } from '../environments/environment';
import { registerIonicons } from './register-ionicons';
import { routes } from './sneat-app-routing.module';

registerIonicons();

export const appConfig: ApplicationConfig = {
	providers: [
		...getStandardSneatProviders(sneatAppEnvironmentConfig),
		provideRouter([...routes, ...authRoutes]), // Add routes later
		TopMenuService,
	],
};
