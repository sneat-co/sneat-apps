import { Provider, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { createErrorHandler, TraceService, init } from '@sentry/angular';
import { Router } from '@angular/router';

export function initSentry(): void {
	console.log('initSentry()');
	init({
		dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
	});
}
export const sneatSentryProviders: Provider[] = [
	{
		provide: ErrorHandler,
		useValue: createErrorHandler({
			showDialog: true,
		}),
	},
	{
		provide: TraceService,
		deps: [Router],
	},
	{
		provide: APP_INITIALIZER,
		useFactory: () => () => {
			// empty as in documentation
			// https://docs.sentry.io/platforms/javascript/guides/angular/#register-traceservice
		},
		deps: [TraceService],
		multi: true,
	},
];
