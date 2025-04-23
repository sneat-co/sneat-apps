import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { SneatAppComponent } from './app/sneat-app.component';
import { appConfig } from './app/sneat-app.config';
import { RouteReuseStrategy } from '@angular/router';
import {
	provideIonicAngular,
	IonicRouteStrategy,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons';
import { getProviders } from './main-providers';

addIcons(allIcons);

const standaloneAppConfig: ApplicationConfig = {
	...appConfig,
	providers: [
		...appConfig.providers,
		...getProviders(),
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideIonicAngular(),
	],
};

export function bootstrapAsStandaloneApp() {
	bootstrapApplication(SneatAppComponent, standaloneAppConfig).catch((err) =>
		console.error(err),
	);
}
