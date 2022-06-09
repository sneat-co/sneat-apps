import { APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { createErrorHandler, TraceService } from '@sentry/angular';
import { LOGGER_FACTORY, loggerFactory } from './logging';

export const coreProviders = [
	{ provide: LOGGER_FACTORY, useValue: loggerFactory },
	{
		provide: APP_INITIALIZER,
		useFactory: () => () => {
		},
		deps: [TraceService],
		multi: true,
	},
	{
		provide: TraceService,
		deps: [Router],
	},
	{
		provide: ErrorHandler,
		useValue: createErrorHandler({
			showDialog: true,
		}),
	},
	{
		provide: RouteReuseStrategy,
		useClass: IonicRouteStrategy,
	},
];
