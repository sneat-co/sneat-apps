import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { LOGGER_FACTORY, loggerFactory } from './logging';

export const coreProviders = [
	{ provide: LOGGER_FACTORY, useValue: loggerFactory },
	{
		provide: RouteReuseStrategy,
		useClass: IonicRouteStrategy,
	},
];
