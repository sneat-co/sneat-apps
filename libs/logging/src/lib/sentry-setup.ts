import {
	Provider,
	inject,
	provideAppInitializer,
	ErrorHandler,
} from '@angular/core';
import { TraceService, init, createErrorHandler } from '@sentry/angular';
import { Router } from '@angular/router';

export function initSentry(): void {
	console.log('initSentry()');
	init({
		dsn: 'https://2cdec43e82bc42e98821becbfe251778@o355000.ingest.sentry.io/6395241',
	});
}

export const sentryAppInitializerProviders: readonly Provider[] = [
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
];

export const provideSentryAppInitializer = () => {
	return provideAppInitializer(() => {
		inject(TraceService);
	});
};
