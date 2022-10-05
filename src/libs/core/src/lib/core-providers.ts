import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { sneatSentryProviders } from '@sneat/logging';
import { LOGGER_FACTORY, loggerFactory } from './logging';

export const coreProviders = [
	...sneatSentryProviders,
	{ provide: LOGGER_FACTORY, useValue: loggerFactory },
	{
		provide: RouteReuseStrategy,
		useClass: IonicRouteStrategy,
	},
];
