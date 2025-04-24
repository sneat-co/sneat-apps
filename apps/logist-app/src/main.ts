// Main entry point for the Logist app

import { bootstrapApplication } from '@angular/platform-browser';
import { DefaultSneatAppApiBaseUrl, SneatApiBaseUrl } from '@sneat/api';
import {
	CONTACT_ROLES_BY_TYPE,
	getStandardSneatProviders,
	provideAppInfo,
	provideRolesByType,
} from '@sneat/app';
import { authRoutes } from '@sneat/auth-ui';
import { RANDOM_ID_OPTIONS } from '@sneat/random';
import { routes } from './app/logist-app-routing.module';
import { provideRouter } from '@angular/router';
import { LogistAppComponent } from './app/logist-app.component';
import { contactRolesByType } from './app/contact-roles-by-type';
import { logistAppEnvironmentConfig } from './environments/environment';
import { registerIonicons } from './register-ionicons';

bootstrapApplication(LogistAppComponent, {
	providers: [
		...getStandardSneatProviders(logistAppEnvironmentConfig),
		// App-specific providers
		provideAppInfo({
			appId: 'logist',
			appTitle: 'Logistus.app',
			requiredSpaceType: 'company',
		}),
		provideRouter([...routes, ...authRoutes]),
		provideRolesByType(undefined),
		{
			provide: SneatApiBaseUrl,
			useValue: logistAppEnvironmentConfig.firebaseConfig.emulator
				? 'http://localhost:4300/v0/'
				: DefaultSneatAppApiBaseUrl,
		},
		{
			provide: CONTACT_ROLES_BY_TYPE,
			useValue: contactRolesByType,
		},
		{
			provide: RANDOM_ID_OPTIONS,
			useValue: { len: 9 },
		},
	],
}).catch((err) => console.error(err));

registerIonicons();
