import { ApplicationConfig } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { APP_INFO, IAppInfo } from '@sneat/core';
import { SneatAppComponent } from './app/sneat-app.component';
import { appConfig } from './app/sneat-app.config';
import { RouteReuseStrategy } from '@angular/router';
import {
	provideIonicAngular,
	IonicRouteStrategy,
} from '@ionic/angular/standalone';

const appInfo: IAppInfo = {
	appId: 'sneat',
	appTitle: 'Sneat.app',
	// requiredSpaceType: SpaceType.sneat,
};

const standaloneAppConfig: ApplicationConfig = {
	...appConfig,
	providers: [
		...appConfig.providers,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideIonicAngular(),
		{
			provide: APP_INFO,
			useValue: appInfo,
		},
	],
};

export function bootstrapAsStandaloneApp() {
	bootstrapApplication(SneatAppComponent, standaloneAppConfig).catch((err) =>
		console.error(err),
	);
}
